// Open folder
{
  var scriptFolder = new File($.fileName).parent;
  var txtFile = new File(scriptFolder + "/workingFolderPath.txt");
  txtFile.open('r');
  var folderPath = txtFile.read();
  txtFile.close();
  var folderPath = folderPath.replace(/\\/g, "/");
  folderPath = folderPath.replace(/(\r\n|\n|\r)/gm, "");
  folderPath = folderPath + "/Output";
  var folder = new Folder(folderPath);
}

//Go through all folders and perform operations
if (folder.exists) {
  var files = folder.getFiles();

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (file instanceof File && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      app.open(file);


      // Run processImages for each image
      {
        var processScript = File(scriptFolder + "/5-2processImage.jsx");
        if (processScript.exists) {
          // Setting argument
          $.evalFile(processScript);
        } else {
          alert("Script file does not exist.");
        }
      }


    }
  }
  // Put them all in Mosaic
  {
    var processScript = File(scriptFolder + "/6placeImages.jsx");
    if (processScript.exists) {
      // Setting argument
      $.evalFile(processScript);

    } else {
      alert("Script file does not exist.");
    }
  }




} else {
  alert("Output folder does not exist");
}

