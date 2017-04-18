var url = "http://localhost/imlcomLive/index.php/Api";
var limit = 4;
var offset = 0;
var offset_song = 0;

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function get_data(page) {
    if (page == 0) {
        get_videos();
    } else if (page == 1) {
        get_post({'action': 'getPost', 'data': {'limit': limit, 'offset': offset, 'offset_song': offset_song}});
    }
//            console.log(page);
}


function get_videos() {
    var data = {"action": "get_videos_front"};
    $.ajax({
        'url': url,
        'type': 'post',
        'data': data,
        success: function (result) {
            //                    console.log(result);
            var obj = $.parseJSON(result);
            if (obj.success) {
                html = '';
                html += '<div class="flex-25 flex-xs-100 layout-column video-section" style="overflow: hidden;">';
                html += '<div style="height: 100%;width: 100%;overflow-y: auto;" class="video-section1">';
                $.each(obj.songs_data, function (index, song) {
                    html += '<div style="margin:2px 0;border:1px solid" class="album_container">';
                    //                            html+='<a href = "video.html?song_id'+song.ID+'">';
//                html += '<a href = "video.html" onclick="videoView(' + song.ID + ')">';
                    html += '<a href = "video.html?songId=' + song.ID + '">';
                    //                            html+='<div class="img_wrapper" style="padding-top:50%;height:0;position:relative;"><div class="img_inner" style="position:absolute;left:0;top:0;right:0;bottom:0;">'
                    html += '<img src="' + obj.image_base_path + '/' + song.Image + '" class="album_image">';
                    //                            html+='</div></div></a>';
                    html += '</div></div></a>';
                    html += '</div>';
                });
                html += '</div></div>';
            }
            $('#artist').html(html);
            resize_image();
        }

    });
}


function resize_image() {
    $('.artist .album_container').each(function () {
        //               console.log(this); 
        var width = $(this).find('.album_image').width();
        var height = width * 9 / 16;
        if (height != 0 && width != 0) {
            $('#artist').find('.album_image').attr('width', width);
            $('#artist').find('.album_image').attr('height', height);
        }
    });
}

function videoView(song_ID) {
    console.log(song_ID);
//    $('.main-view').slideUp();
//                    $('div.title').hide();
//    $('ion-header-bar').prepend('<a class="button back_button_show_hide buttons button-icon ion-arrow-left-c" onclick="switch_back(this);"></a>');
    $('ion-header-bar').prepend('<a class="button back_button_show_hide buttons button-icon ion-arrow-left-c" href="index.html"></a>');
//    $('.video-view').show();
    var data = {'action': 'get_videos_single', 'data': {'songId': song_ID}};
    $.ajax({
        'url': url,
        'type': 'post',
        'data': data,
        success: function (result) {

            var width = $(window).width();
            var height = width * 9 / 16;
            var obj = $.parseJSON(result);
            console.log(obj);
            var html = '';
            html += '<div class="flex-70 flex-xs-100 layout-column youtube-section">';
            html += '<video height=' + height + ' width=' + width + ' controls autoplay>';
            html += '<source src="' + obj.video_base_path + '/' + obj.songs_data.Song_File_Name + '" type="video/mp4">';
            html += '</video>';
            html += '<div class="layout-column">';
            html += '<div class="layout-row layout-xs-column youtube-user-detail">';
            html += '<div class="flex-100 flex-xs-100 layout-column layout-align-start-start">';
            html += '<h4>' + obj.songs_data.Song_Title + '</h4>';
            html += '</div>';
            //                    html+='<div class="flex-50 flex-xs-100 layout-align-end-end layout-row">';
            //                        html+='<h4 id="views">'+obj.songs_data.HITS+' views</h4>';
            //                    html+='</div>';
            html += '</div>';
            html += '<div class="layout-row">';
            html += '<div class="topic-detail layout-column">';
            html += '<span>Published on ' + obj.songs_data.created_On + '</span>';
            html += '<span>' + obj.songs_data.synopsis + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="layout-row  share-it">';
            html += '<span class="layout-row flex-20 layout-align-start-center">';
            html += '<span>' + obj.songs_data.HITS + ' views</span>'
            html += '</span>';
            html += '<span class="layout-row flex-30 layout-align-start-center">';
            html += '</span>';
            html += '<span class="layout-row flex-20 layout-align-start-center">';
            html += '</span>';
            html += '<span class="layout-row flex-50 layout-align-end-center">';
            html += '<span><i class="fa fa-hand-o-up"></i>888</span> &nbsp;&nbsp;   ';
            html += '<span><i class="fa fa-hand-o-down"></i>6</span>   ';
            html += '</span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            var html1 = '';
            html1 += '<div class="layout-column flex-30 flex-xs-100 more-video-secton ">';
            html1 += '<div class="layout-column youtube-more-section">';
            //                html1+='<p>More Songs</p>';
            html1 += '<div class="flex-25 flex-xs-100 layout-column video-section" style="overflow: hidden;">';
            html1 += '<div style="height: 100%;width: 100%;overflow-y: auto;" class="video-section1">';
            $.each(obj.artistAllVideo, function (index, artistVideo) {

                html1 += '<div class="layout-row">';
//                html1 += '<a href = "javascript:;" onclick="videoView(' + artistVideo.ID + ')">';
                html += '<a href = "video.html?songId=' + artistVideo.ID + '">';
                html1 += '<img src="' + obj.image_base_path + '/' + artistVideo.Image + '" class="album_image">';
                html1 += '</a>';
                html1 += '</div>';
                html1 += '<div class="layout-column user-detail">';
                html1 += '<span class="user-name">' + artistVideo.Song_Title + '</span>';
                html1 += '</div>';
            });
            html1 += '<a href="javascript:void(0);" class="moreVideo" onclick="moreVideos(this);"><i class="fa fa-angle-down"></i></a>';
            html1 += '<a href="javascript:void(0);" class="lessVideo" onclick="lessVideos(this);" style="display:none"><i class="fa fa-angle-up"></i></a>';
            html1 += '<div class="more_videos" style="display:none">';
            $.each(obj.allVideos, function (index, allVideo) {
                html1 += '<div class="layout-row">';
//                html1 += '<a href = "javascript:;" onclick="videoView(' + allVideo.ID + ')">';
                html1 += '<a href = "video.html?songId=' + allVideo.ID + '">';
                html1 += '<img src="' + obj.image_base_path + '/' + allVideo.Image + '" class="album_image">';
                html1 += '</a>';
                html1 += '</div>';
                html1 += '<div class="layout-column user-detail">';
                html1 += '<span class="user-name">' + allVideo.Song_Title + '</span>';
                html1 += '</div>';
            });
            html1 += '</div>';
            html1 += '</div>';
            html1 += '</div>';
            html1 += '</div>';
            html1 += '</div>';
            
            var commentHtml='';
            $.each(obj.comments, function (index, comment) {
               commentHtml+='<div class="layout-row user-comments-youtube">';
                                commentHtml+='<img src="' + obj.image_base_path + '/' + comment.Image + '" alt="user-image"/>';
                                commentHtml+='<div class="layout-column user-detail flex-90" id="main_comment">';
                                    commentHtml+='<div class="layout-row">';
                                        commentHtml+='<div class="layout-column flex-90">';
                                            commentHtml+='<div class="layout-row">';
                                                commentHtml+='<span class="user-name">'+comment.FirstName+' '+comment.LastName+'</span>';
                                                
                                            commentHtml+='</div>';  
                                            commentHtml+='<div>'+comment.COMMENTS+'</div>';
                                            commentHtml+='<div class="layout-row">';
                                                commentHtml+='<span class="user-name"><a href="javascript:void(0)" onclick="replyOnComment(this)" >Reply</a> &nbsp; &nbsp;<a href="javascript:void(0)" onclick="likeComment(this)" ><i class="fa fa-thumbs-up"></a></i>&nbsp;  &nbsp; <a href="javascript:void(0)" onclick="dislikeComment(this)" ><i class="fa fa-thumbs-down"></i></a></span>';
                                            commentHtml+='</div>';
                                        commentHtml+='</div>';
                                        commentHtml+='<div class="float-right flex-10 layout-row layout-align-end-start"><i class="fa fa-ellipsis-v"></i></div> ';
                                    commentHtml+='</div>';
                                    
                                commentHtml+='</div>';
                            commentHtml+='</div>'; 
            });
            
            $('#video_page_header').html(html);
            $('#video_page_footer').html(html1);

            $('.album_image').each(function () {

                var width = $(this).width();
                var height = width * 9 / 16;
                if (height != 0 && width != 0) {
                    $(this).attr('width', width);
                    $(this).attr('height', height);
                }
            });
        }
    });
}

function moreVideos(obj) {
//    console.log($(this).parent().find('.more_videos'));
    $(obj).parent().find('.more_videos').slideDown();
    $(obj).hide();
    $(obj).parent().find('.lessVideo').show();
    $(obj).parent().find('.album_image').each(function () {

        var width = $(this).width();
        var height = width * 9 / 16;
        if (height != 0 && width != 0) {
            $(this).attr('width', width);
            $(this).attr('height', height);
        }
    });
}   

function lessVideos(obj) {
//    console.log($(this).parent().find('.more_videos'));
    $(obj).parent().find('.more_videos').slideUp();
      $(obj).hide();
    $(obj).parent().find('.moreVideo').show();
    
    

}
function switch_back(obj) {
    //            console.log(hello);
    //            location.reload();
    $('#video_page').hide();
    $('div.title').show();
    console.log(obj);

    $('ion-header-bar').each(function () {
        $(this).find('.back_button_show_hide').remove();
    });
    $(obj).remove();
//                    ('<button class="button back_button_show_hide back-button buttons button-icon ion-arrow-left-c header-item" onclick="switch_back();">');
    $('ion-view').slideDown();
    //            $('ion-nav-view').hide();
}

function get_post(data) {
//        offset += limit;

    $.ajax({
        'url': url,
        'data': data,
        'type': 'post',
        success: function (result) {
            var obj = $.parseJSON(result);
            var base_url = obj.base_url;
            var site_url = obj.site_url;
            console.log(obj);
            offset_song = obj.song_offset;
            var html = '';
            if (obj.success) {
                    $.each(obj.comment, function (index, comments) {
//                        console.log(comments);
                        var user_image = base_url + 'uploads/images/user.png'
                        if (comments.Photo != '') {
                            user_image = base_url + 'uploads/images/' + comments.Photo;
                        }
                        if (comments.song) {
                            html += '<div class="layout-column comment-section" data-song_id = "' + comments.ID + '">';
                        } else {
                            html += '<div class="layout-column comment-section" data-post_id = "' + comments.COM_ID + '">';
                        }
                        html += '<div class="layout-row user-comments profile_info" data-location="' + base_url + 'index.php/User/profile/' + comments.UID + '">';
                        html += '<img src="' + user_image + '" alt="user-image"/>';
                        html += '<div class="comment-wrap">' + comments.FirstName + ' ' + comments.LastName + '</div>';
                        html += '</div><hr style="    margin-top: 5px;margin-bottom: 5px;">';
                        if (comments.song) {
                            html += '<div class="layout-row user-comments">';
                            html += '<div class="">';
                            html += '<span>' + comments.Song_Title + '</span>';
                            html += '</div>';
                            html += '</div>';
                            html += '<div class="layout-row user-comments">';
                            html += '<div class="">';
                            html += '<span>' + comments.synopsis + '</span>';
                            html += '</div>';
                            html += '</div>';
                            html += '<div class="layout-column layout-align-center-center" >';
                            html += '<a href="' + site_url + '/Video/index/' + comments.ID + '"><img src="' + base_url + '/uploads/images/' + comments.Image + '" height = 170></a>';
                            html += '</div>';
                        }
                        if (comments.COMMENTS != '' && !comments.song) {
                            html += '<div class="layout-row user-comments">';
                            html += '<div class="">';
                            html += '<span>' + comments.COMMENTS + '</span>';
                            html += '</div>';
                            html += '</div>';
                        }
                        if (comments.attachment != null && !comments.song) {
                            $.each(comments.attachment, function (key, attach) {
                                if (attach.attachment_type == 'audios') {
                                    html += '<div class="layout-column layout-align-center-center" data-att_id="' + attach.att_id + '">';
                                    html += '<audio controls>';
                                    html += '<source src="' + base_url + '/uploads/audios/' + attach.attachment_path + '" type="audio/ogg">';
                                    html += '</audio>';
                                    html += '</div>';
                                } else if (attach.attachment_type == 'videos') {
                                    html += '<div class="layout-column layout-align-center-center" data-att_id="' + attach.att_id + '">';
                                    html += '<video height="auto" controls>';
                                    html += '<source src="' + base_url + '/uploads/videos/' + attach.attachment_path + '" type="video/mp4">';
                                    html += '</video>';
                                    html += '</div>';
                                } else if (attach.attachment_type == 'images') {
                                    html += '<div class="layout-column layout-align-center-center" data-att_id="' + attach.att_id + '">';
                                    html += '<img src="' + base_url + '/uploads/images/' + attach.attachment_path + '" height = 170>';
                                    html += '</div>';
                                }
                            });
                        }
                        html += '<div class="layout-row action-wrapper">';
                        var response = comments.user_response;
//                        console.log(comments.user_response);
                        if (comments.song) {
                            if (response == '1') {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.ID + ')" data-post_type="1" data-response_type="1" data-commentid="' + comments.ID + '"><i class="fa fa-thumbs-up liked"></i></a>';

                            } else {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.ID + ')" data-post_type="1" data-response_type="1" data-commentid="' + comments.ID + '"><i class="fa fa-thumbs-up"></i></a>';

                            }
                            html += '<span class="like_count_span">';
                            if (comments.like_count) {
                                html += comments.like_count + ' Likes ';
                            }
                            html += '</span>';
                            html += '</div>';
                        } else {
                            if (response == '1') {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="2" data-response_type="1" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
                            } else {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="2" data-response_type="1" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-up"></i></a>';
                            }
                            html += '<span class="like_count_span">';
                            if (comments.like_count) {
                                html += comments.like_count + ' Likes ';
                            }
                            html += '</span>';
                            html += '</div>';
                        }
                        if (comments.song) {
                            if (response == 2) {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.ID + ')" data-post_type="1" data-response_type="2" data-commentid="' + comments.ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                            } else {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.ID + ')" data-post_type="1" data-response_type="2" data-commentid="' + comments.ID + '"><i class="fa fa-thumbs-down"></i></a>';
                            }
                            html += '<span class="dislike_count_span">';
                            if (comments.dislike_count) {

                                html += comments.dislike_count + ' Dislikes';
                            }
                            html += '</span>';
                            html += ' </div>';
                        } else {
                            if (response == 2) {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="2" data-response_type="2" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                            } else {
                                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="2" data-response_type="2" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-down"></i></a>';
                            }
                            html += '<span class="dislike_count_span">';
                            if (comments.dislike_count) {

                                html += comments.dislike_count + ' Dislikes';
                            }
                            html += '</span>';
                            html += ' </div>';
                        }
                        html += '<div class="layout-row layout-align-start-center flex-25" ><a href="#" class="comment_button"><i class="fa fa-comment"></i>Comments</a></div>';
//                        html += '<div class="layout-row layout-align-end-center flex-20"><i class="fa fa-share"></i> Share</div>';
                        html += '</div>';
                        html += '<div class="comment_textarea" style="display:none">';
                        html += '<textarea class="col-md-11" placeholder="Comment"></textarea>';
                        html += '<button class="btn btn-info col-md-1 comment_submit" onclick="commentSubmit(this);"><i class="fa fa-arrow-right"></i></button>';
                        html += '</div>';

                        if (typeof comments.subComments !== "undefined" && comments.subComments.length !== 0) {
                            html += '<div class="layout-row comment-wrap">';
//                            html += '<span class="flex-75">View Previous Comments</span>';
                            html += '</div>';
                            $.each(comments.subComments, function (scKey, sc) {
                                console.log(sc);
                                var sc_response = sc.user_response;
                                var user_image = base_url + 'uploads/images/user.png';
                                if (sc.Photo != '') {
                                    user_image = base_url + 'uploads/images/' + sc.Photo;
                                }
                                html += '<div class="layout-row user-comments" style="width:100%;">';
                                html += '<img src="' + user_image + '" alt="user-image"/>';
                                html += '<div class="layout-column user-detail" style="width:100%;">';
                                html += '<div class="layout-row">';
                                html += '<span class="user-name">' + sc.FirstName + ' ' + sc.LastName + '</span>';
                                html += '<span>' + sc.COMMENTS + '</span>';
                                html += '</div>';
                                html += '<div class="layout-row action-wrapper">';
                                if (sc_response == '1') {
                                    html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
                                } else {
                                    html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-up"></i></a>';
                                }
                                html += '<span class="like_count_span">';
                                if (sc.like_count) {
                                    html += sc.like_count + ' Likes';
                                }
                                html += '</span>';
                                html += '</div>';
                                if (sc_response == '2') {
                                    html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                                } else {
                                    html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-down"></i></a>';
                                }
                                html += '<span class="dislike_count_span">';
                                if (sc.dislike_count) {
                                    html += sc.dislike_count + ' Dislikes';
                                }
                                html += '</span>';
                                html += '</div>';
                                html += '</div>';
                                html += '</div>';
                                html += '<hr>';
                                html += '</div>';
                            });
                        }
                        html += '</div>';
                    });

                    $('#public_wall').append(html);
                    $('.md-close').trigger('click');
                    $('.comment_button').on('click', function () {
                        $(this).parent().parent().parent().find('.comment_textarea').show();
                    });

                    $(".profile_info").mouseover(function () {
                        $(this).css('cursor', 'pointer');
                    });

                    $('.profile_info').on("click", function () {
//                        var user = '<?php echo $_SESSION['user_data']['UID']; ?>';
                        var location = $(this).data("location");
                        if (user) {
                            window.location.replace(location);
                        } else {
                            alert('Please Login to use the service.');
                        }
                    });
            }
            if (obj.comment.length !== 0) {
                offset += limit;
//                offset_ind += limit_ind;
//                get_post({'limit': limit, 'offset': offset, 'offset_song': offset_song});
                get_post({'action': 'getPost', 'data': {'limit': limit, 'offset': offset, 'offset_song': offset_song}});
            }
        }

    });
}

