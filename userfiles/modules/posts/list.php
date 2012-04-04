<?php

/*

type: module
name: Posts list
description: Module to display posts list.
param_file: Module to display posts list.

*/

?>
<?
/**
 * 
 * 
 * Generic module to display posts list.
 * @author Peter Ivanov
 * @package content
* 
* 
* Example:
*  @example:  
* 
*  <microweber module="posts/list"  category="<? print  $category['id'] ?>" />
*  
* 
* 
* 
*  @param $categories | array of categories | default:false
*  @param $category | integer of category | default:false
*  @param $limit | how many items per page | default:30
*  
*  @param $no_results_text | prints this if there are no results | default:false
*  @param $auto_login | if true will login automaticly the usera after registration | default:false
*  @param include_pages | if true will include_pages| default:false
*  @param read_more_link_text | the text on the read more link
*  @param delete_post_link | if set it will display delete post link
*/

?>
<?php
 
 

    $post_params= array();
	if($display){
	$post_params['display']= $display;
	}
	
	if($category){
		$category = explode(',', $category);
	$post_params['selected_categories'] = $category;
	} else {
		
	}
	
	if(!empty($categories)){
	$post_params['selected_categories'] = $categories;
	}
	
	//
	if(!$limit){
		$limit = 30;
	}
	if($limit){
	$post_params['items_per_page'] = $limit;
	}
	
	
	if($created_by){
	 
	$post_params['created_by'] = $created_by;
	}
	
	if($voted_by){
	 
	$post_params['voted_by'] = $voted_by;
	}
	
	 
	
	if($keyword){
	 
	$post_params['keyword'] = $keyword;
	}
	
	
	
	
	if($file){
	 
	$post_params['file'] = $file;
	}
	
	
	if($curent_page){
	$post_params['curent_page'] = $curent_page;
	} else {
		
		$curent_page = url_param('curent_page');
		if(intval($curent_page)!= false){
			$post_params['curent_page'] = $curent_page;
		} else{
		$post_params['curent_page'] = 1;
		}
	}
	
	if($params['tn_size'] != false){
		$tn_s = $params['tn_size'];
		
		
	} else {
		
		 $tn_s = 150;
	}
	//$this->appvar->set('items_per_page', $post_params['items_per_page']); 
	//$this->appvar->set('curent_page', $post_params['curent_page']); 
 if($params['include_pages']){
	 $pages_params = array();
	 if($keyword){
	 $pages_params['keyword'] = $keyword;
	  
	 
	 }
 
	 $pages = get_pages($pages_params);
	
 }
 
 
	$posts = get_posts($post_params);
$results = $posts['posts'];
if(!empty($pages)){
	 
	$results = array_merge($pages, $results);
	
}
if(empty($results)){
	$results =$pages;
}
 


 if(isset($delete_post_link)){
	 
}

 
  if(!$params['read_more_link_text']){
	  
	 $read_more_link_text = 'Read more';
	// p($pages);
 }else {
	  $read_more_link_text = $params['read_more_link_text'];
 }


?>
    
 
    
<? if(empty($results )): ?>
<? if(($no_results_text )): ?>
<? print $no_results_text ; ?>
<? endif; ?>
<?  else : ?>
<? if($file): ?>
<? //foreach($posts['posts'] as $post): ?>
<?
if(stristr($file, '.php') == false){
	
	$file = $file.'.php';
}
	$try_file1 = TEMPLATE_DIR . $file;
	include($try_file1);
//$this->template ['posts'] = $posts['posts'];
//$this->template ['data'] = $posts;
//				$this->load->vars ( $this->template );
//				
//				$content_filename = $this->load->file ( $try_file1, true );
//				print $content_filename;
?>
<? //endforeach; ?>
<?  else : ?>
<? if(!$display and !$file): ?>

<ul class="posts-list">
  <? foreach($results as $post): ?>
  <li itemscope itemtype="http://schema.org/Article" class="single-post content-type-<? print $post['content_type'] ?>" data-post-id='<? print $post['id'];  ?>'><a data-post-id='<? print $post['id'];  ?>'  class="post-title"  href="<? print post_link($post['id']); ?>"  itemprop="name"><? print $post['content_title'] ?></a>
    <div class="single-post-info"> <span class="single-post-author">by <span itemprop="author"><? print user_name($post['created_by']); ?></span></span> | <span class="single-post-date">published on <span itemprop="datePublished"><? print ($post['created_on']); ?></span></span> </div>
    
    
    
    <? if( $tn_s  != 'none'): ?>
    <a itemprop="url" href="<? print post_link($post['id']); ?>" class="img" style="background-image: url('<? print thumbnail($post['id'], $tn_s) ?>')"><span></span></a>
    <? endif; ?>
    <? if(trim($post['content_description'])== ''){
		$post['content_description'] = character_limiter($post['content_body_nohtml'], 150);
	} ?>
    <p class="single-post-description" itemprop="description"><? print $post['content_description'];  ?></p>


    <span class="single-post-links">
    <a itemprop="url" href="<? print post_link($post['id']); ?>" class="single-post-more-link" data-post-id='<? print $post['id'];  ?>'><? print $read_more_link_text; ?></a>
  
  <? if(trim($params['delete_post_link'])!= '') : ?>

		<a itemprop="url-delete"  class="single-post-delete-link" data-post-id='<? print $post['id'];  ?>'><? print $params['delete_post_link'] ?></a>
  <? endif; ?>
 </span>


 </li>

  <? endforeach; ?>
</ul>
<? endif; ?>
<? endif; ?>
<? endif; ?>