<?php

namespace App\Models;

use Silex\Application;


class Project
{
    public $id;
    public $name;
    public $color;
    public $year;
    public $logo;

    public $preview_url;
    public $description;

    public $fields;

    public $comments;

    private $is_logo_uploaded = false;

    private $Id;
    private $entity;

    public function __construct($project_entity = null) {
        if ($project_entity) {
            $this->entity = $project_entity;
        }
        else {
            $ar = array(
                'fields' => array(),
                'comments' => array()
                );

            $this->entity['de'] = $ar;
            $this->entity['en'] = $ar;
        }
    }

    public function getId() {
        return $this->entity['de']['id'];
    }

    public function getColor() {
        return $this->entity['de']['color'];
    }

    public function getPreviewUrl() {
        return $this->entity['de']['preview_url'];
    }

    public function getYear() {
        return $this->entity['de']['year'];
    }

    public function getLogo() {
        return $this->entity['de']['logo'];
    }

    public function getLogoShort() {
        return $this->entity['de']['logo_short'];
    }

    public function getName($lang) {
        return $this->entity[$lang]['name'];
    }

    public function getGenre($lang) {
        return $this->entity[$lang]['genre'];
    }

    public function getDescription($lang) {
        $res = $this->entity[$lang]['description'];
        return preg_replace('#<br\s*/?>#i', "\n", $res);
    }

    public function getFields() {
        $result = array();

        if (!$this->entity)
            return $result;

        foreach ( $this->entity as $lang => $item) {
            $i = 0;
            foreach ($item['fields'] as $key => $field) {
                $result[$i][$lang]['id'] = $field['id'];
                $result[$i][$lang]['name'] = $field['name'];
                $result[$i][$lang]['value'] = $field['value'];
                $i++;
            }
        }

        return $result;
    }

    public function getComments() {
        $result = array();

        if (!$this->entity)
            return $result;

        foreach ( $this->entity as $lang => $item) {
            $i = 0;
            foreach ($item['comments'] as $key => $comment) {
                $result[$i]['image_url'] = $comment['image_url'];
                $result[$i][$lang]['id'] = $comment['id'];
                $result[$i][$lang]['text'] = $comment['text'];
                $i++;
            }
        }

        return $result;
    }

    /* ATTRIBUTES */

    public function getIdAttrName() {
        return "project[de][id]";
    }

    public function getColorAttrName() {
        return "project[de][color]";
    }

    public function getPreviewUrlAttrName() {
        return "project[de][preview_url]";
    }

    public function getYearAttrName() {
        return "project[de][year]";
    }

    public function getLogoAttrName() {
        return "project[de][logo]";
    }

    public function getLogoShortAttrName() {
        return "project[de][logo_short]";
    }

    public function getNameAttrName($lang) {
        return "project[$lang][name]";
    }

    public function getGenreAttrName($lang) {
        return "project[$lang][genre]";
    }

    public function getDescriptionAttrName($lang) {
        return "project[$lang][description]";
    }

    public function getFieldsIdAttrName($lang, $field_id) {
        return "project[$lang][fields][$field_id][id]";
    }

    public function getFieldsNameAttrName($lang, $field_id) {
        return "project[$lang][fields][$field_id][name]";
    }

    public function getFieldsValueAttrName($lang, $field_id) {
        return "project[$lang][fields][$field_id][value]";
    }

    public function getCommentsIdAttrName($lang, $comment_id) {
        return "project[$lang][comments][$comment_id][id]";
    }

    public function getCommentsTextAttrName($lang, $comment_id) {
        return "project[$lang][comments][$comment_id][text]";
    }

    public function getCommentsImageUrlAttrName($lang, $comment_id) {
        return "project[$lang][comments][$comment_id][image_url]";
    }

    public function setProjectFromPost( $data )
    {
        $this->name = $data['name'];
        $this->color = $data['color'];
        $this->year = $data['year'];

        $this->preview_url = $data['preview_url'];
        $this->description = str_replace("\n", '<br/>', trim($data['description']));;

        if ( $this->isImageUploaded('logo') ) {
            $this->is_logo_uploaded = true;
            $this->logo = $this->moveUploadedImageToImagesDir('logo', 'movies');
        }

        $this->setFieldsAndCommentsFromPostArray( $data );

    }

    private function isImageUploaded( $image_id )
    {
        if ( !isset($_FILES[$image_id]) ) {
            return false;
        }

        $file = $_FILES[$image_id];
        if ( !file_exists($file['tmp_name']) || !is_uploaded_file($file['tmp_name']) ) {
            return false;
        }

        return true;
    }

    private function moveUploadedImageToImagesDir ( $image, $sub_dir )
    {
        $img_dir = "img/$sub_dir";
        $upload_directory = dirname($_SERVER["SCRIPT_FILENAME"]) . '/' . $img_dir;
        $image_file_name = str_replace(' ', '_', $_FILES[$image]['name']);
        move_uploaded_file($_FILES[$image]["tmp_name"], "$upload_directory/$image_file_name");

        return "$img_dir/$image_file_name";
    }

    public function setFieldsAndCommentsFromPostArray( $data, $images_required = true )
    {
        $fields = array();
        $comments = array();

        foreach ( $data as $key => $value ) {
            if ( preg_match('/^field_(?P<name>.+)_(?P<id>.+)/', $key, $matches ) ) {
                if ( isset($fields[$matches['id']]) ) {
                    $fields[$matches['id']][$matches['name']] = $value;
                }
                else {
                    $fields[$matches['id']] = array( $matches['name'] => $value);
                }
            }
            else if ( preg_match('/^comment_(?P<name>.+)_(?P<id>.+)/', $key, $matches ) ) {
                $cid = $matches['id'];
                if ( isset($comments[$cid]) ) {
                    $comments[$cid][$matches['name']] = $value;
                }
                else {
                    $comments[$cid] = array( $matches['name'] => $value);
                }
            }
        }

        foreach ( $comments as $key => $comment ) {
            $comment['text'] = str_replace("\n", '<br/>', trim($comment["text"]));
        }

        $this->fields = $fields;
        $this->comments = $comments;
    }

    public function loadProjectData( Application $app )
    {
        $q = $app['db']->prepare('select * from project_fields p where p.movie_id = :id');
        $q->bindValue(':id', $this->id);
        $q->execute();
        $this->fields = $q->fetchAll();

        $q = $app['db']->prepare('select * from project_comments where movie_id = :id');
        $q->bindValue(':id', $this->id);
        $q->execute();
        $comments = $q->fetchAll();
        foreach ( $comments as $key => $comment ) {
            $comments[$key]['text'] = str_replace('<br/>', "\n", $comment['text']);
        }
        $this->comments = $comments;
    }

    public function saveToDB( Application $app )
    {
        $is_new = !isset($this->id);

        $this->saveProject($app, $is_new);

        if ( $is_new ) {
            $this->id = $app['db']->lastInsertId();
        }

        $this->saveDescription($app, $is_new);

        $this->updateFieldsInDB($app, $is_new);

        $this->updateCommentsInDB($app, $is_new);
    }

    public function saveProject( Application $app, $is_new = false) {
        if ( $is_new ) {
            $r = 'INSERT INTO projects (name, color, year, logo) VALUES (:name, :color, :year, :logo)';
            var_dump($r);
            $q = $app['db']->prepare($r);
        }
        else {
            $r = 'update projects set name=:name, color=:color, year=:year'
                . ($this->is_logo_uploaded ? ', logo=:logo' : '')
                . ' where id=:movie_id;';
            $q = $app['db']->prepare($r);
            $q->bindValue(':movie_id', $this->id);
        }
        $q->bindValue(':name', $this->name);
        $q->bindValue(':color', $this->color);
        $q->bindValue(':year', $this->year);
        if ( $this->is_logo_uploaded ) {
            $q->bindValue(':logo', $this->logo);
        }
        $q->execute();
    }

    public function saveDescription ( Application $app, $is_new = false )
    {
        if ( $is_new ) {
            $q = $app['db']->prepare('INSERT INTO project_description (preview_url, description, movie_id) VALUES (:preview_url, :description, :id)');

        }
        else {
            $q = $app['db']->prepare('UPDATE project_description set preview_url=:preview_url, description=:description where movie_id=:id');
        }
        $q->bindValue(':preview_url', $this->preview_url);
        $q->bindValue(':description', $this->description);
        $q->bindValue(':id', $this->id);
        $q->execute();
    }

    public function updateFieldsInDB ( Application $app, $is_new = false )
    {
        $q = $app['db']->prepare('select id from project_fields where movie_id=:id');
        $q->bindValue(':id', $this->id);
        $q->execute();
        $fields_id = $q->fetchAll(\PDO::FETCH_COLUMN);

        foreach ( $this->fields as $key => $field ) {
            $id_index = array_search($key, $fields_id);

            if ( $id_index !== false ) {
                unset($fields_id[$id_index]);

                $r = 'UPDATE project_fields SET field_name=:field_name, field_value=:field_value WHERE id=:id';
                $q = $app['db']->prepare($r);
                $q->bindValue(':id', $key);
            }
            else {
                $r = 'INSERT INTO project_fields (field_name, field_value, movie_id) VALUES (:field_name, :field_value, :id)';
                $q = $app['db']->prepare($r);
                $q->bindValue(':id', $this->id);
            }

            $q->bindValue(':field_name', $field['name']);
            $q->bindValue(':field_value', $field['value']);
            $q->execute();
        }

        foreach ( $fields_id as $key => $f_id ) {
            $q = $app['db']->prepare('DELETE FROM project_fields WHERE id=:id');
            $q->bindValue(':id', $f_id);

            $q->execute();
        }
    }

    public function updateCommentsInDB ( Application $app, $is_new = false )
    {
        $comments_images = array();

        $q = $app['db']->prepare('select id from project_comments where movie_id=:id');
        $q->bindValue(':id', $this->id);
        $q->execute();
        $comments_id = $q->fetchAll(\PDO::FETCH_COLUMN);

        foreach ( $this->comments as $id => $comment ) {
            $img_name = 'comment_img_' . $id;
            $comments_images[$id] = '';

            if ( $this->isImageUploaded($img_name) ) {
                $comments_images[$id] = $this->moveUploadedImageToImagesDir($img_name, 'movies/comments');
            }
        }

        foreach ( $this->comments as $key => $comment ) {
            $id_index = array_search($key, $comments_id);

            if ( $id_index !== false ) {
                unset($comments_id[$id_index]);

                $r = 'UPDATE project_comments SET text=:text'
                    . ($comments_images[$key] ? ', image_url=:img' : '')
                    .' WHERE id=:id';

                $q = $app['db']->prepare($r);
                $q->bindValue(':id', $key);
            }
            else {
                $r = 'INSERT INTO project_comments (text, image_url, movie_id) VALUES (:text, :img, :movie_id)';
                $q = $app['db']->prepare($r);
                $q->bindValue(':movie_id', $this->id);
                $q->bindValue(':img', '');
            }

            $q->bindValue(':text', $comment['text']);
            if ( $comments_images[$key] ) {
                $q->bindValue(':img', $comments_images[$key]);
            }
            $q->execute();
        }

        foreach ( $comments_id as $key => $cid ) {
            $q = $app['db']->prepare('DELETE FROM project_comments WHERE id=:id');
            $q->bindValue(':id', $cid);

            $q->execute();
        }
    }
}