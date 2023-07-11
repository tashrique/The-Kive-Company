//Initialize files
{
    var path = openFile();
}
//Open file and get Filepath
function openFile() {
    var scriptFolder = new File($.fileName).parent;
    var txtFile = new File(scriptFolder + "/workingFolderPath.txt");
    txtFile.open('r');
    var folderPath = txtFile.read();
    txtFile.close();
    var folderPath = folderPath.replace(/\\/g, "/");
    folderPath = folderPath.replace(/(\r\n|\n|\r)/gm, "");
    folderPath = folderPath + "/Output";
    folderPath = String(folderPath);
    return folderPath;
}
//Save JPG and close
function saveJPGandClose() {
    var doc = app.activeDocument;
    doc.trim(TrimType.TRANSPARENT);

    var file = new File(path + '.jpg');
    var jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.embedColorProfile = true;
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
    jpgSaveOptions.matte = MatteType.NONE;
    jpgSaveOptions.quality = 12; // Maximum quality
    doc.saveAs(file, jpgSaveOptions, true, Extension.LOWERCASE);

    // Close the document without saving changes (since we've just saved it)
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

//put them into positions


function main() {

    //Initialize
    {
        var docs = app.documents;
        var numDocs = docs.length;

        // Define the coordinates for each grid cell
        var gridCells = [
            { x: 618, y: 618 }, // Grid cell 1
            { x: 1696, y: 618 }, // Grid cell 2
            { x: 2777, y: 618 }, // Grid cell 3
            { x: 3853, y: 618 }, // Grid cell 4
            { x: 4932, y: 618 }, // Grid cell 5

            { x: 618, y: 1696 }, // Grid cell 6
            { x: 1696, y: 1696 }, // Grid cell 7
            { x: 2777, y: 1696 }, // Grid cell 8
            { x: 3853, y: 1696 }, // Grid cell 9
            { x: 4932, y: 1696 }, // Grid cell 10

            { x: 618, y: 2777 }, // Grid cell 11
            { x: 1696, y: 2777 }, // Grid cell 12
            { x: 2777, y: 2777 }, // Grid cell 13
            { x: 3853, y: 2777 }, // Grid cell 14
            { x: 4932, y: 2777 }, // Grid cell 15

            { x: 618, y: 3853 }, // Grid cell 16
            { x: 1696, y: 3853 }, // Grid cell 17
            { x: 2777, y: 3853 }, // Grid cell 18
            { x: 3853, y: 3853 }, // Grid cell 19
            { x: 4932, y: 3853 }, // Grid cell 20

            { x: 618, y: 4932 }, // Grid cell 21
            { x: 1696, y: 4932 }, // Grid cell 22
            { x: 2777, y: 4932 }, // Grid cell 23
            { x: 3853, y: 4932 }, // Grid cell 24
            { x: 4932, y: 4932 }, // Grid cell 25


        ];


        if (numDocs !== gridCells.length) {
            alert("Number of open documents doesn't match the grid size");
            return;
        }

        var scriptFolder = new File($.fileName).parent;
        var templateFile = new File(scriptFolder + "/template25.psd");
        var newDoc = app.open(templateFile);

        app.activeDocument = newDoc;
    }

    for (var i = 0; i < numDocs; i++) {
        var sourceDoc = docs[i];
        app.activeDocument = sourceDoc;

        // Get the coordinates for the current grid cell
        var cell = gridCells[i];

        for (var j = 0; j < sourceDoc.layers.length; j++) {
            app.activeDocument = sourceDoc;

            var layer = sourceDoc.layers[j];
            var newLayer = layer.duplicate(newDoc, ElementPlacement.PLACEATEND);
            app.activeDocument = newDoc;

            // Compute the center position of the current grid cell

            var cellCenterX = cell.x;
            var cellCenterY = cell.y;



            // Adjust for the layer's size to position its center at the cell's center
            var layerCenterX = cellCenterX - (newLayer.bounds.width / 2);
            var layerCenterY = cellCenterY - (newLayer.bounds.height / 2);

            alert(layerCenterX);
            alert(layerCenterY);

            // Move the layer to the computed position
            newLayer.translate(layerCenterX, layerCenterY);
        }
    }
    app.activeDocument = newDoc;
}


// Save the result and close
// saveJPGandClose();


main();

// now as all the pictures are in the new doc, i want it to position all of these pictures into a grid of 25 according to layer name. i want to position the images center center of the position.
