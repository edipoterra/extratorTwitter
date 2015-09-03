<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Extrator Twitter</title>
        <meta http-equiv="Content-Type" content="text/html;charset=iso-8859-1" />

        <link href="assets/css/bootstrap.css" rel="stylesheet">
        <link href="assets/css/extrator.css" rel="stylesheet">
        
        <script src="assets/js/jquery-1.8.3.min.js" language="javascript"></script>     
        <script src="assets/js/extratorTwitter.js" language="javascript"></script>                        
    </head>
    <body>
        <?php
        require("utils/header.php");
        ?>
        <div class="container">
            <div class="content">
                <div class="row">
                    <div class="span14">    
                    <div id="posts">
                    </div>
					<div id="loading">
						<center><img src="assets/images/loader.gif" height="100" width="100" /></center>
						<center><h2>Carregando dados do Twitter...</h2></center>
					</div>
                </div>                  
            </div>
        <?php
        require("utils/footer.php");
        ?>
        </div> 
        
        <footer>
            <p>Edipo Terra</p>
        </footer>
    <script src="assets/js/jquery.min.js" type="text/javascript"></script>
    <script src="assets/js/bootstrap-modal.js" type="text/javascript"></script>
    <script src="assets/js/bootstrap-tooltip.js" type="text/javascript"></script>
    <script src="assets/js/bootstrap-popover.js" type="text/javascript"></script>
    <script src="assets/js/bootstrap-tab.js" type="text/javascript"></script>
    <script src="assets/js/timuork-general.js" type="text/javascript"></script>
    <script src="assets/js/timuork-popoverHandler.js" type="text/javascript"></script>
    <script src="assets/js/timuork-home.js" type="text/javascript"></script>
    <script src="assets/js/friendface-cadastro.js" type="text/javascript"></script>
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-30009537-1']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
    <script type="text/javascript">
        var home = new Home();
    </script>

    </body>
</html>
