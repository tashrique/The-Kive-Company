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

function getGroupByName(doc, name) {
    for (var i = 0; i < doc.layerSets.length; i++) {
        if (doc.layerSets[i].name === name) {
            return doc.layerSets[i];
        }
    }
    return null; // Return null if no group with the given name was found
}

function moveLayersToGroups() {
    var doc = app.activeDocument;

    // Loop through each layer in the document
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];

        // If layer is a group, locked or is a text layer, skip this layer
        if (layer.typename === "LayerSet" || layer.allLocked || layer.kind === LayerKind.TEXT) {
            continue;
        }

        // Get the name of the layer (which should be a zero-padded number)
        var numStr = layer.name;

        // Get the corresponding group (which should have the same name as the layer)
        var group = getGroupByName(doc, numStr);

        // If the group does not exist, skip this layer
        if (!group) {
            continue;
        }

        // Move the layer to the group
        layer.move(group, ElementPlacement.INSIDE);
    }
}



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

            // Convert the layer's bounds to simple numbers
            var layerWidth = newLayer.bounds[2].as('px') - newLayer.bounds[0].as('px');
            var layerHeight = newLayer.bounds[3].as('px') - newLayer.bounds[1].as('px');

            // Adjust for the layer's size to position its center at the cell's center
            var layerCenterX = cellCenterX - (layerWidth / 2);
            var layerCenterY = cellCenterY - (layerHeight / 2);

            // Move the layer to the computed position
            newLayer.translate(UnitValue(layerCenterX, 'px'), UnitValue(layerCenterY, 'px'));
        }

    }
    app.activeDocument = newDoc;












    {
        // iterate over all the layers in the new document
        for (var i = 0; i < newDoc.layers.length; i++) {
            var layer = newDoc.layers[i];

            if (layer.typename === "LayerSet" || layer.allLocked || layer.kind === LayerKind.TEXT) {
                continue;
            }

            // The layer name is the group name where this layer should be moved
            var groupName = layer.name;

            // Find the group layer with the same name as the current layer
            var groupLayer = findGroupLayer(newDoc, groupName);

            // If such a group exists, move the layer into this group
            if (groupLayer) {
                layer.move(groupLayer, ElementPlacement.INSIDE);
            } else {
                alert("Couldn't find a group named " + groupName + " to move the layer " + layer.name);
            }
        }

        function findGroupLayer(doc, groupName) {
            for (var i = 0; i < doc.layerSets.length; i++) {
                if (doc.layerSets[i].name === groupName) {
                    return doc.layerSets[i];
                }
            }
            // If no matching group is found, return null
            return null;
        }

    }
}


// Save the result and close
// saveJPGandClose();


main();

// now as all the pictures are in the new doc, i want it to position all of these pictures into a grid of 25 according to layer name. i want to position the images center center of the position.
