<!doctype html> 
<html> 
<head> 
<title>JSON kokeilu</title> 
</head> 
<body> 

<?php 
if(isset($_GET["x"])){ 
    $myArr=$_GET["x"];     
    $myJSON = json_encode($myArr); 
    echo $myJSON; 
} 
?> 

</body> 
</html>