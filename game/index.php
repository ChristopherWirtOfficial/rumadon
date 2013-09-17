<?php
$require_login = true;
include('includes/core.php');
?>
<html>
<head>
<title>Game</title>
<link rel="stylesheet" type="text/css" href="css/interface.css" />
<link rel="stylesheet" type="text/css" href="css/admin.css" />
<link rel="stylesheet" type="text/css" href="css/map.css" />
<link rel="stylesheet" type="text/css" href="css/tiles.css" />
<link rel="stylesheet" type="text/css" href="css/sprites.css" />
<link rel="stylesheet" type="text/css" href="css/characters.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/microactions.js"></script>
<script type="text/javascript" src="js/playerfunctions.js"></script>
<script type="text/javascript" src="js/playerdata.js"></script>
<script type="text/javascript" src="js/mapdata.js"></script>
<script type="text/javascript" src="js/map_rendering.js"></script>
<script type="text/javascript" src="js/controls.js"></script>
<script type="text/javascript" src="js/admin.js"></script>
<script type="text/javascript" src="js/init.js"></script>
</head>
<body onkeydown="keyCatch(event)">
<div id="contain-map">
	<div id="loading-display">
		<div id="loading-spinner">
			<img src="images/loading.gif" />
			<br />
			<span id="loadingStep">loading...</span> <span id="loadingPercent">0%</span>
		</div>
	</div>
	<div id="map"></div>
	<div id="updatelog" style="color:#fff;width:200px;height:200px;position:absolute;right:0;top:0"></div>
<?php
if($me->user_level == 2) {
?>
<div id="admin-panel">
	<div id="admin-tool-panel">
		<div id="admin-tool-panel-left">
			Tools: &nbsp; <a href="javascript:" class="selected-tool" id="admin-add-tool">Add</a>
			&nbsp; &bull; &nbsp;
			<a href="javascript:" id="admin-delete-tool">Delete</a>
		</div>
		<div id="admin-tool-panel-right">
			<a href="javascript:" id="admin-save">Save</a>
		</div>
	</div>
	<div id="admin-tile-panel">
		<img src="images/tiles/grass.png" height="90px" id="admin_tile_grass" class="selected-admin-tile" />
		<img src="images/tiles/water.png" height="90px" id="admin_tile_water" />
		<img src="images/tiles/water_top.png" height="90px" id="admin_tile_water_top" />
		<img src="images/tiles/water_left.png" height="90px" id="admin_tile_water_left" />
		<img src="images/tiles/water_top_left.png" height="90px" id="admin_tile_water_top_left" />
	</div>
</div>
<?php
}
?>
</div>
</body>
</html>