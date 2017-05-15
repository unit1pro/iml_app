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
        var user_id = localStorage.getItem("user_id");
        get_post({'action': 'getPost', 'data': {'limit': limit, 'offset': offset, 'offset_song': offset_song, 'user_id': user_id}});
    } else if(page == 2){
        var userid = localStorage.getItem("user_id");
        if(userid){
            $('#login_form').hide();
            $('#profile').show();
            profile_show(userid,false);
        } else {
            $('#login_form').show();
            $('#profile').hide();
        }
    }
}


function get_videos() {
    var data = {"action": "get_videos_front"};
    $.ajax({
        'url': url,
        'type': 'post',
        'data': data,
        success: function (result) {
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
        var width = $(this).find('.album_image').width();
        var height = width * 9 / 16;
        if (height != 0 && width != 0) {
            $('#artist').find('.album_image').attr('width', width);
            $('#artist').find('.album_image').attr('height', height);
        }
    });
}

function viewPost(post_id) {
    $('ion-header-bar').prepend('<a class="button back_button_show_hide buttons button-icon ion-arrow-left-c" href="index.html"></a>');
    var userid = localStorage.getItem("user_id");

    if(userid){
        var data = {'action':'post_view','data':{'post_id':post_id, 'user_id':userid}};      
    } else {
        alert('Please login to post your views');
    }
}

function videoView(song_ID) {
    $('ion-header-bar').prepend('<a class="button back_button_show_hide buttons button-icon ion-arrow-left-c" href="index.html"></a>');
    var userid = localStorage.getItem("user_id");
    var data = {'action': 'get_videos_single', 'data': {'songId': song_ID, 'user_id': userid}};
    $.ajax({
        'url': url,
        'type': 'post',
        'data': data,
        success: function (result) {

            var width = $(window).width();
            var height = width * 9 / 16;
            var obj = $.parseJSON(result);

            var html = '';
            html += '<div class="flex-70 flex-xs-100 layout-column youtube-section">';

            // html += '<div class="top_container"';
            html += '<div class="video_container">';
            html += '<div class="overlay">';
            html += '<div class="text-container">';
            // html += '<h4>Please choose video</h4>';
            html += '<div class="layout-row">';
            html += '<a href = "video.html?songId=' + obj.songs_data.ID + '">';
            html += '<img src="' + obj.video_base_path + '/' + obj.songs_data.Image + '" class="album_image">';
            html += '</a>';
            html += '</div>';
            html += '</div>';
            $.each(obj.allVideos, function (index, allVideo) {
                html += '<div class="layout-row">';
                html += '<a href = "video.html?songId=' + allVideo.ID + '">';
                html += '<img src="' + obj.image_base_path + '/' + allVideo.Image + '" class="album_image">';
                html += '</a>';
                html += '</div>';
            });
            html += '</div>';

            html += '<video height=' + height + ' width=' + width + ' controls>';
            html += '<source src="' + obj.video_base_path + '/' + obj.songs_data.Song_File_Name + '" type="video/mp4">';
            html += '</video>';
            html += '</div>';
            // html += '</div>';
            html += '<div class="layout-column">';
            html += '<div class="layout-row layout-xs-column youtube-user-detail">';
            html += '<div class="flex-100 flex-xs-100 layout-column layout-align-start-start">';
            html += '<h4>' + obj.songs_data.Song_Title + '</h4>';
            html += '</div>';
            html += '<div class="flex-50 flex-xs-100 layout-align-end-end layout-row">';
            html += '<h4 id="views">' + obj.songs_data.HITS + ' views</h4>';
            html += '</div>';
            html += '</div>';
            html += '<div class="layout-row">';
            html += '<div class="topic-detail layout-column">';
            html += '<span>Published on ' + obj.songs_data.created_On + '</span>';
            html += '<span>' + obj.songs_data.synopsis + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="layout-row share-it">';
            // html += '<span class="layout-row flex-20 layout-align-start-center">';
            // html += '<span>' + obj.songs_data.HITS + ' views</span>'
            // html += '</span>';
            // html += '<span class="layout-row flex-30 layout-align-start-center">';
            // html += '</span>';
            // html += '<span class="layout-row flex-20 layout-align-start-center">';
            // html += '</span>';
            html += '<div class="layout-row action-wrapper" style="width:100%">';

            if (obj.songs_data.user_response == '1') {
                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + song_ID + ')" data-post_type="1" data-response_type="1" data-commentid="' + song_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
            } else {
                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + song_ID + ')" data-post_type="1" data-response_type="1" data-commentid="' + song_ID + '"><i class="fa fa-thumbs-up"></i></a>';
            }
            html += '<span class="like_count_span">';

            if (obj.songs_data.total_likes) {
                html += obj.songs_data.total_likes + ' Likes ';
            }
            html += '</span></div>';
            if (obj.songs_data.user_response == 2) {
                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + song_ID + ')" data-post_type="1" data-response_type="2" data-commentid="' + song_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
            } else {
                html += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + song_ID + ')" data-post_type="1" data-response_type="2" data-commentid="' + song_ID + '"><i class="fa fa-thumbs-down"></i></a>';
            }
            html += '<span class="dislike_count_span">';
            if (obj.songs_data.total_dislikes) {
                html += obj.songs_data.total_dislikes + ' Dislikes';
            }
            html += '</div></div>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
            var html1 = '';
            html1 += '<div class="layout-column flex-30 flex-xs-100 more-video-secton ">';
            html1 += '<div class="layout-column youtube-more-section">';
            html1 += '<div class="flex-25 flex-xs-100 layout-column video-section" style="overflow: hidden;">';
            html1 += '<div style="height: 100%;width: 100%;overflow-y: auto;" class="video-section1">';
            $.each(obj.artistAllVideo, function (index, artistVideo) {

                html1 += '<div class="layout-row">';
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

            var commentHtml = '';
            commentHtml = '<div id="comment_section">';
            $.each(obj.comments, function (index, comment) {

                var comment_response = comment.user_response;
                var user_image = obj.base_url + 'uploads/images/user.png';
                if (comment.Photo != '') {
                    user_image = obj.base_url + 'uploads/images/' + comment.Photo;
                }
                commentHtml += '<div class="layout-row user-comments" style="width:100%;">';
                commentHtml += '<a href="profile.html?userId='+comment.UID+'"><span class="profile-img"><img src="' + user_image + '" alt="user-image"/></span></a>';
                commentHtml += '<div class="layout-column user-detail" style="width:100%;">';
                commentHtml += '<div class="layout-row">';
                commentHtml += '<span class="user-name">' + comment.FirstName + ' ' + comment.LastName + '</span>';
                commentHtml += '<span>' + comment.COMMENTS + '</span>';
                commentHtml += '</div>';
                commentHtml += '<div class="layout-row action-wrapper">';
                if (comment_response == '1') {
                    commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comment.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + comment.COM_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
                } else {
                    commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comment.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + comment.COM_ID + '"><i class="fa fa-thumbs-up"></i></a>';
                }
                commentHtml += '<span class="like_count_span">';
                if (comment.total_likes) {
                    commentHtml += comment.total_likes + ' Likes';
                }
                commentHtml += '</span>';
                commentHtml += '</div>';
                if (comment_response == '2') {
                    commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comment.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + comment.COM_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                } else {
                    commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comment.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + comment.COM_ID + '"><i class="fa fa-thumbs-down"></i></a>';
                }
                commentHtml += '<span class="dislike_count_span">';
                if (comment.total_dislikes) {
                    commentHtml += comment.total_dislikes + ' Dislikes';
                }
                commentHtml += '</span>';
                commentHtml += '</div>';
                commentHtml += '</div>';
                commentHtml += '</div>';
                commentHtml += '<hr>';
                commentHtml += '</div>';
            });
            commentHtml += '</div>';

            $('#video_page_header').html(html);
            $('#video_page_footer').html(html1);
            $('#video_page_comment').append(commentHtml);

            // $('.album_image').each(function () {

            //     var width = $(this).width();
            //     var height = width * 9 / 16;
            //     if (height != 0 && width != 0) {
            //         $(this).attr('width', width);
            //         $(this).attr('height', height);
            //     }
            // });


            var views = $('#views').html();
            new_view = views.match(/\d+/)[0];
            new_view++;

            post_hit_count({'new_view': new_view, 'song_id': song_ID});

            setTimeout(function(){
                 $('.overlay').hide();
                 $('video')[0].play();
            }, 5000);

            // console.log($('.video_container').height());


            // $('.overlay').width($('.video_container').width());
            // $('.overlay').height($('.video_container').height());
            $('.overlay').width(100);
            $('.overlay').height(100);
        }
    });
}

function moreVideos(obj) {
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
    $(obj).parent().find('.more_videos').slideUp();
    $(obj).hide();
    $(obj).parent().find('.moreVideo').show();

}

function switch_back(obj) {
    //            location.reload();
    $('#video_page').hide();
    $('div.title').show();

    $('ion-header-bar').each(function () {
        $(this).find('.back_button_show_hide').remove();
    });
    $(obj).remove();
//                    ('<button class="button back_button_show_hide back-button buttons button-icon ion-arrow-left-c header-item" onclick="switch_back();">');
    $('ion-view').slideDown();
    //            $('ion-nav-view').hide();
}

function get_post(data) {

    $.ajax({
        'url': url,
        'data': data,
        'type': 'post',
        success: function (result) {
            var obj = $.parseJSON(result);
                
            var base_url = obj.base_url;
            var site_url = obj.site_url;

            offset_song = obj.song_offset;
            var html = '';
            if (obj.success) {
                $.each(obj.comment, function (index, comments) {
                    if(typeof(comments.UID) !== 'undefined'){
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
                        html += '<a href="profile.html?userId='+comments.UID+'"><span class="profile-img"><img src="' + user_image + '" alt="user-image"/></span>';
                        html += '<span class="comment-wrap">' + comments.FirstName + ' ' + comments.LastName + '</span></a>';
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
                            html += '<a href = "video.html?songId=' + comments.ID + '"><img src="' + base_url + '/uploads/images/' + comments.Image + '"  height="170" onerror="myFunction(this);"></a>';
                            // html += '<p id="demo"></p>';
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
                        html += '<div class="layout-row layout-align-start-center flex-25" ><a href="#" class="comment_button" onclick="comment_area(this)"><i class="fa fa-comment"></i>Comments</a></div>';
    //                        html += '<div class="layout-row layout-align-end-center flex-20"><i class="fa fa-share"></i> Share</div>';
                        html += '</div>';
                        html += '<div class="comment_textarea" style="display:none">';
                        // html += '<textarea id="commentarea" class="col-md-11" placeholder="Comment"></textarea>';
                        // html += '<button class="btn btn-info col-md-1 comment_submit" onclick="commentSubmit(this);"><i class="fa fa-arrow-right"></i></button>';
                        html += '<div class="input-group">';
                        html += '<textarea class="form-control custom-control"  placeholder="Comment" style="resize:none"></textarea>';
                        html += '<span class="input-group-addon btn btn-primary comment_submit" onclick="commentSubmit(this);">Comment</span>';
                        html += '</div>';
                        html += '</div>';

                        if (typeof comments.subComments !== "undefined" && comments.subComments.length !== 0) {
                            html += '<div class="layout-row comment-wrap">';
    //                            html += '<span class="flex-75">View Previous Comments</span>';
                            html += '</div>';
                            $.each(comments.subComments, function (scKey, sc) {
                                var sc_response = sc.user_response;
                                var user_image = base_url + 'uploads/images/user.png';
                                if (sc.Photo != '') {
                                    user_image = base_url + 'uploads/images/' + sc.Photo;
                                }
                                html += '<div class="layout-row user-comments" style="width:100%;">';
                                html += '<a href="profile.html?userId='+sc.UID+'"><span class="profile-img"><img src="' + user_image + '" alt="user-image"/></span></a>';
                                html += '<div class="layout-column user-detail" style="width:100%;">';
                                html += '<div class="layout-row">';
                                html += '<a href="profile.html?userId='+sc.UID+'"><span class="user-name">' + sc.FirstName + ' ' + sc.LastName + '</span></a>';
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
                        
                    }
                });

                $('#public_wall').append(html);
                $('.md-close').trigger('click');

                $(".profile_info").mouseover(function () {
                    $(this).css('cursor', 'pointer');
                });

                $('.profile_info').on("click", function () {
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

function myFunction(element) {
     $(element).attr('src','http://localhost/imlcomLive//uploads/images/404.png');
}

function comment_area(element){
    $(element).parent().parent().parent().find('.comment_textarea').toggle('show');
}

function checkValid(form) {

    var formId = $(form).attr('id');
    var valid = 1
    var required = 1;
    $('#' + formId + ' .autocheck').each(function () {
        if (!$(this).attr('data-valid')) {
            valid = 0;
        }
    });
    $('#' + formId + ' .require').each(function () {
        if ($(this).val() == '') {
            $(this).css('border', '1px solid #ff0000');
            required = 0;
        }
    });
    if (!valid || !required) {
        // alert("Please fill all the required fields and enter unique username and email");
        return false;
    } else {
        return true;
    }
}

function register_user(element) {
    var valid = checkValid($(element).parent());
    if (valid) {
        var username = $(element).parent().find('#UserName').val();
        var firstName = $(element).parent().find('#FirstName').val();
        var lastName = $(element).parent().find('#LastName').val();
        var email = $(element).parent().find('#Email').val();
        var password = $(element).parent().find('#Password').val();

        $.ajax({
            'url': url,
            'data': {'action': 'register', 'data': {'UserName': username, 'FirstName': firstName, 'LastName': lastName, 'Email': email, 'Password': password, 'UserType': '4'}},
            'type': 'post',
            success: function (result) {
                var obj = $.parseJSON(result);
                localStorage.setItem("username", obj.user_data);
                localStorage.setItem("login_status", '1');
            }
        });
    }
}

function login_user(element) {
    var valid = checkValid($(element).parent());
    if (valid) {
        var login_user_name = $(element).parent().find('#l_username').val();
        var login_password = $(element).parent().find('#l_password').val();

        $.ajax({
            'url': url,
            'data': {'action': 'login', 'data': {'UserName': login_user_name, 'Password': login_password}},
            'type': 'post',
            success: function (result) {
                var obj = $.parseJSON(result);
                if (obj.success == true) {
                    localStorage.setItem("user_id", obj.userData.UID);
                    localStorage.setItem("login_status", true);
                    $('#login_form').hide();
                    $('#profile').show();
                    profile_show(obj.userData.UID,false);
                    $(element +'input').val('');
                } else if (obj.success == false) {
                    localStorage.setItem("login_status", false);
                    $(element).parent().find('#Login_msg').text(obj.error).css('color', 'red');
                }
            }
        });
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function likeFunction(element, commentId) {

    var post_type = $(element).data('post_type');
    var response_type = $(element).data('response_type');
    var userid = localStorage.getItem("user_id");
    if (userid) {
        $.ajax({
            'url': url,
            'data': {'action': 'like', 'data': {'comment_id': commentId, 'post_type': post_type, 'response_type': response_type, 'userid': userid}},
            'type': 'post',
            success: function (result) {
                var obj = $.parseJSON(result);
                if (obj.msg == '1') {
                    $(element).find('i').addClass('liked');
                    $(element).parent().next().find('.dislike_button').find('i').removeClass('disliked');
                } else if (obj.msg == '2') {
                    $(element).find('i').addClass('disliked');
                    $(element).parent().prev().find('.like_button').find('i').removeClass('liked');
                } else {
                    $(element).find('i').removeClass('liked');
                    $(element).find('i').removeClass('disliked');

                }
                if (obj.likeCount != 0) {
                    $(element).parent().parent().find(".like_count_span").html(obj.likeCount + ' Likes');
                } else {
                    $(element).parent().parent().find(".like_count_span").html('');
                }
                if (obj.dislikeCount != 0) {
                    $(element).parent().parent().find('.dislike_count_span').html(obj.dislikeCount + ' Dislikes');
                } else {
                    $(element).parent().parent().find('.dislike_count_span').html('');
                }
            }
        });

    } else {
        alert('Please Login to use the Service!!!');
    }
}

function commentSubmit(ele) {
    var userid = localStorage.getItem("user_id");
    if (userid) {
        var comment = $(ele).parent().find('textarea').val();
        var post_id = $(ele).parent().parent().parent().attr('data-post_id');
        var song_id = $(ele).parent().parent().attr('data-song_id');
        if (typeof post_id === "undefined") {
            var data = {'action': 'comment', 'data': {'parent_id': -1, 'COMMENTS': comment, 'Song_id': song_id, 'userid': userid}};
        } else {
            var data = {'action': 'comment', 'data': {'parent_id': post_id, 'COMMENTS': comment, 'userid': userid}};
        }
        $.ajax({
            'url': url,
            'data': data,
            'type': 'post',
            success: function (result) {

                var obj = $.parseJSON(result);
                    console.log(obj);
                var base_url = obj.base_url;
                var commentHtml = '';
                if (obj.success) {

                    $.each(obj.comment, function (scKey, sc) {
                        var comment_response = sc.user_response;
                        var user_image = obj.base_url + 'uploads/images/user.png';
                        if (sc.Photo !== '') {
                            user_image = obj.base_url + 'uploads/images/' + sc.Photo;
                        }
                        commentHtml += '<div class="layout-row user-comments" style="width:100%;">';
                        commentHtml += '<a href="profile.html?userId='+sc.UID+'"><span class="profile-img"><img src="' + user_image + '" alt="user-image"/></span></a>';
                        commentHtml += '<div class="layout-column user-detail" style="width:100%;">';
                        commentHtml += '<div class="layout-row">';
                        commentHtml += '<a href="profile.html?userId='+sc.UID+'"><span class="user-name">' + sc.FirstName + ' ' + sc.LastName + '</span></a>';
                        commentHtml += '<span>' + sc.COMMENTS + '</span>';
                        commentHtml += '</div>';
                        commentHtml += '<div class="layout-row action-wrapper">';
                        if (comment_response == '1') {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
                        } else {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-up"></i></a>';
                        }
                        commentHtml += '<span class="like_count_span">';
                        if (sc.like_count) {
                            commentHtml += sc.like_count + ' Likes';
                        }
                        commentHtml += '</span>';
                        commentHtml += '</div>';
                        if (comment_response == '2') {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                        } else {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + sc.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + sc.COM_ID + '"><i class="fa fa-thumbs-down"></i></a>';
                        }
                        commentHtml += '<span class="dislike_count_span">';
                        if (sc.dislike_count) {
                            commentHtml += sc.dislike_count + ' Dislikes';
                        }
                        commentHtml += '</span>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '<hr>';
                        commentHtml += '</div>';
                    });
                    $(ele).parent().parent().next().append(commentHtml);
                }
            }
        });
    } else {
        alert('Please Login to user the service.');
    }
}

function post_hit_count(data) {
    $.ajax({
        'url': url,
        'data': {'action': 'video_views', 'data': {'data': data}},
        'type': 'post',
        success: function (result) {
        }
    });
}

function song_comment(comment, user_id, song_id) {
    if (comment != '' && user_id && song_id) {
        var data = {'action': 'video_comment', 'data': {'COMMENTS': comment, 'userid': user_id, 'Song_id': song_id}};
        $.ajax({
            url: url,
            data: data,
            type: 'post',
            success: function (result) {
                var obj = $.parseJSON(result);
                var commentHtml = '';
                if (obj.success) {
                    $.each(obj.comment, function (index, comments) {
                        var comment_response = comments.user_response;
                        var user_image = obj.base_url + 'uploads/images/user.png';
                        if (comments.Photo !== '') {
                            user_image = obj.base_url + 'uploads/images/' + comments.Photo;
                        }
                        commentHtml += '<div class="layout-row user-comments" style="width:100%;">';
                        commentHtml += '<img src="' + user_image + '" alt="user-image"/>';
                        commentHtml += '<div class="layout-column user-detail" style="width:100%;">';
                        commentHtml += '<div class="layout-row">';
                        commentHtml += '<span class="user-name">' + comments.FirstName + ' ' + comments.LastName + '</span>';
                        commentHtml += '<span>' + comments.COMMENTS + '</span>';
                        commentHtml += '</div>';
                        commentHtml += '<div class="layout-row action-wrapper">';
                        if (comment_response == '1') {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-up liked"></i></a>';
                        } else {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="like_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="3" data-response_type="1" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-up"></i></a>';
                        }
                        commentHtml += '<span class="like_count_span">';
                        if (comments.like_count) {
                            commentHtml += comments.like_count + ' Likes';
                        }
                        commentHtml += '</span>';
                        commentHtml += '</div>';
                        if (comment_response == '2') {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-down disliked"></i></a>';
                        } else {
                            commentHtml += '<div class="layout-row layout-align-start-center flex-20"><a href="javascript:void(0)" class="dislike_button" onclick="likeFunction(this, ' + comments.COM_ID + ')" data-post_type="3" data-response_type="2" data-commentid="' + comments.COM_ID + '"><i class="fa fa-thumbs-down"></i></a>';
                        }
                        commentHtml += '<span class="dislike_count_span">';
                        if (comments.dislike_count) {
                            commentHtml += comments.dislike_count + ' Dislikes';
                        }
                        commentHtml += '</span>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '<hr>';
                        commentHtml += '</div>';
                    });
                    $('#comment_section').prepend(commentHtml);
                }
            }
        });
    }
}

function profile_show(userid, public){
    
    var data = {'action': 'show_profile', 'data': { 'userid': userid}};
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        success: function (result) {
            var obj = $.parseJSON(result);
            var profile_html = '';
            if (obj.success) {
                $.each(obj.profile_data, function (index, profile) {
                    var user_image = obj.base_url + 'uploads/images/user.png';
                    if (profile.Photo != '') {
                        user_image = obj.base_url + 'uploads/images/' + profile.Photo;
                    }
                    // profile_html += '<div class="col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">';
                    profile_html += '<div class="well profile">';
                    // profile_html += '<div class="col-sm-12">';
                    profile_html += '<div class="col-xs-12">';
                    profile_html += '<div class="profile_image_container halfwidth">';
                    profile_html += '<img src="'+ user_image +'" alt="" class="img-responsive" >';
                    profile_html += '<a href = "update.html?action=picture"><input type="button" class="btn btn-info btn-xs" value="Change" style="position:absolute;top:5px;right:5px;"/></a>';
                    profile_html += '</div>';
                    profile_html += '</div>';
                    profile_html += '<div class="col-xs-12">';
                    profile_html += '<ul class="list-group">';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">Name: </strong><p> '+ profile.FirstName +' '+ profile.LastName +'</p></li>';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">Email: </strong><p> '+ profile.Email +' </p></li>';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">DOB: </strong><p> '+ profile.DOB +' </p></li>';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">City: </strong><p> '+ profile.City +' </p></li>';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">State: </strong><p> '+ profile.State +' </p></li>';
                    profile_html += '<li class="list-group-item"><strong class="pull-left">Country: </strong><p> '+ profile.Country +' </p></li>';
                    profile_html += '</ul>';

                    if(!public){
                        profile_html += '<div class="col-xs-12 col-sm-4 emphasis">';
                        profile_html += '<button class="btn btn-info btn-xs update_button"><a href = "update.html?action=account"><span class="fa fa-cog"></span> Password </a></button>';                        
                        profile_html += '<button class="btn btn-info btn-xs update_button"><a href = "update.html?action=profile"><span class="fa fa-user"></span> Update </a></button>';
                        profile_html += '<button class="btn btn-danger btn-xs logout_button" onclick="logout()"><span class="fa fa-sign-out "></span> Logout </button>';
                        profile_html += '</div>';                        
                    }
                    profile_html += '</div></div>';
                });
                $('#profile').html(profile_html);
            } 
        }
    });
}

function logout(){
    localStorage.setItem("user_id", '');
    localStorage.setItem("login_status", false);
    localStorage.clear();
    $('#login_form').show();
    $('#profile').hide();
    // location.reload();
}

function edit_profile(callBack){

    var user_id = localStorage.getItem("user_id");
    var data = {'action': 'show_profile', 'data': { 'userid': user_id}};
    var obj;
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        cache: false,
        success: function (result) {
            obj = $.parseJSON(result);
            callBack(obj);
        }
    });
}