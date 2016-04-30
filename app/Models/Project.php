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

    public $fields;

    public $comments;

    public function setProjectFromPost( $data ) {

    }

    public function loadProjectData( Application $app ) {
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

    public function setFieldsAndCommentsFromPostArray( $data, $images_required = true ) {
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
                if ( isset($comments[$matches['id']]) ) {
                    $comments[$cid][$matches['name']] = $value;
                }
                else {
                    if ( !$images_required or $_FILES['comment_img_' . $cid]['size'] > 1 ) {
                        $comments[$cid] = array( $matches['name'] => $value);
                        $comments[$cid]['file'] = $_FILES['comment_img_' . $cid];
                    }
                }
            }
        }

        $this->fields = $fields;
        $this->comments = $comments;
    }
}