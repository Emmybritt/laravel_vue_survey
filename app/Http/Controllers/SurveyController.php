<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use Illuminate\Http\Request;
use App\Http\Resources\SurveyResource;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str; 
use Illuminate\Validation\Rule;
use App\Models\SurveyQuestion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate(5));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $survey = Survey::create($data);

        // Create sureveys questions
        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorised Action.');
        }
        return new SurveyResource($survey);
    }


    public function showForGuest(Survey $survey)
    {
        // $user = $request->user();
        // if ($user->id !== $survey->user_id) {
        //     return abort(403, 'Unauthorised Action.');
        // }
        return new SurveyResource($survey);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            var_dump($survey->image);

            // If there is an old image when deleting the survey, delete the image aswell  
            if ($survey->image) {
                $absolute = public_path($survey->image);
                File::delete($absolute);
            }
        }
        $survey->update($data);

        // Get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();

        // get ids as plain array of new question

        $newIds = Arr::pluck($data['questions'], 'id');

        // find question to delete

        $toDelete = array_diff($existingIds, $newIds);

        // find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // Delete questions by $toDelete array

        SurveyQuestion::destroy($toDelete);

        // create new questions

        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }
        

        // Update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }


        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorised Action.');
        }
        // if there is no image delete the current survey
        if ($survey->image) {
            $absolute = public_path($survey->image);
            File::delete($absolute);
        }
        $survey->delete();
        return response('', 204);
    }

    // This function check if the image is a valid image
    public function saveImage($image){
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // get the file extension
            $type = strtolower($type[1]);

            // Check if the file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'PNG'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = \base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        }else{
            throw new \Exception("did not match data URI with image data");
        }
        $dir = 'images/';
        $file = Str::random(). '.' . $type;
        $absolutPath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutPath)) {
            File::makeDirectory($absolutPath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }
    private function createQuestion($data)
    {
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_SELECT,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
            ]);

            return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data){
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion, id',
            'question' => 'required|string',
            'type' => ['required', Rule::in(
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_SELECT,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
            )],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);
        return $question->update($validator->validated());
    }
}
