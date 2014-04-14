<?php
require_once( dirname(__FILE__) . '/wp-load.php' );
global $current_user;
$user_info = get_currentuserinfo();

?>
<!DOCTYPE html>
 <html>
 <head>
    <meta charset="utf-8">
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport' />
    <title>pray and tell</title>
     <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300' rel='stylesheet' type='text/css'>
    <link type="text/css" rel="stylesheet" href="css/slidebars.css">
    <link type="text/css" rel="stylesheet" href="css/bootstrap.min.css">
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/slidebars.js"></script>
    <!-- Overridding CSS file -->
    <link type="text/css" rel="stylesheet" href="css/prayandtell.css">
    

    <script>
        $(document).ready(function(event){
            $.slidebars();
        });
    </script>
 </head>
 <body>
 	<div class="navbar navbar-default navbar-fixed-top sb-slide" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header header">
                    <button class="navbar-toggle sb-toggle-left header-left">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a id="logo" class="navbar-brand" href="#"><span class="logo-box">p<span class="hidden3">ray</span></span><span class="logo-alt"><span class="hidden3">a</span>n<span class="hidden3">d</span></span><span class="logo-box">t<span class="hidden3">ell</span></span></a>
                    <h1 class="text-center header-context1">
                        <p>Red Cross MA</p>
                    </h1>
                    <button class="navbar-toggle sb-toggle-right header-right">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                
            </div>
        </div><!-- end fixed header navigation -->
     
    <div id="sb-site" class="container">
        <h1 class="text-center header-context2"><small><i>All prayer requests</i></small></h1>
        <ul class="feed">
            <li>
              <div class="marker"><i>30 minutes ago</i></div>
              <div class="post">
                <div class="profile">
                  <img class="img-responsive circle" src="img/simon.png" width=90>
                    <?php echo user_avatar_get_avatar($current_user->ID, 150); ?>
                    <section>
                        <h3>Simon Ma</h3>
                        <p>Near Malden, MA</p>
                    </section>
                </div>
                <div class="feed-body">
                  <p>Please pray for my family in Costa Rica. #healing</p>

                </div>

                <div class="feed-footer">
                    <strong><a>+1 prayer</a></strong>
                    <a class="pull-right">share</a>
                    <span class="pull-right">|</span>
                    <a class="pull-right">Explore</a>
                </div>
              </div>
            </li>
            
            <li class="right">
              <div class="marker"><i>March 14th</i></div>
              <div class="post">
                <div class="profile">
                  <img class="img-responsive circle" src="img/charles.png" width=90>
                    <section>
                        <h3>Charles Essien</h3>
                        <p>Near Santa Rosa, CA</p>
                    </section>
                </div>
                <div class="feed-body">
                  <p>Thank God for my new job! I start tomorrow! #opportunity</p>

                </div>

                <div class="feed-footer">
                    <strong><a>+1 prayer</a></strong>
                    <a class="pull-right">share</a>
                    <span class="pull-right">|</span>
                    <a class="pull-right">Explore</a>
                </div>
              </div>
            </li>
            
            <li>
              <div class="marker"><i>January 24th</i></div>
              <div class="post">
                <div class="profile">
                  <img class="img-responsive circle" src="img/charles.png" width=90>
                    <section>
                        <h3>Charles Essien</h3>
                        <p>Near Worcester, MA</p>
                    </section>
                </div>
                <div class="feed-body">
                  <p>HELLO WORLD</p>

                </div>

                <div class="feed-footer">
                    <strong><a>+1 prayer</a></strong>
                    <a class="pull-right">share</a>
                    <span class="pull-right">|</span>
                    <a class="pull-right">Explore</a>
                </div>
              </div>
            </li>
        
        </ul>
        
    </div><!-- .container -->
    <div class="sb-slidebar sb-left navigation"></div>
    <div class="sb-slidebar sb-right navigation">
        <section>
            <h2>Charles Essien</h2>
            <div class="profile">
                <img class="img-responsive circle" src="img/charles.png" width=90>
                <div>
                    <a>profile</a><a>account settings</a>
                </div>
            </div>
        </section>
    </div>
     
 </body>
</html>
