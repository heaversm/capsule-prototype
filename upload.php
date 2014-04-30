<?php

$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

  if ($_FILES["camcorder"]["error"] > 0) {
    echo "Return Code: " . $_FILES["camcorder"]["error"] . "<br>";
  } else {
    echo "Upload: " . $_FILES["camcorder"]["name"] . "<br>";
    echo "Type: " . $_FILES["camcorder"]["type"] . "<br>";
    echo "Size: " . ($_FILES["camcorder"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["camcorder"]["tmp_name"] . "<br>";
    if (file_exists("upload/" . $_FILES["camcorder"]["name"])) {
      echo $_FILES["camcorder"]["name"] . " already exists. ";
    } else {
      move_uploaded_file($_FILES["camcorder"]["tmp_name"],
      "upload/" . $_FILES["camcorder"]["name"]);
      echo "Stored in: " . "upload/" . $_FILES["camcorder"]["name"];
    }
  }

?>
