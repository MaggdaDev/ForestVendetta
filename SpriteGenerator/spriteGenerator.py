

#%% load files
from os import listdir
import imageio.v3 as iio
#lookup mask
LOOKUP_MASK_FOLDER_PATH = "input/lookupMask/"
lookupMaskFolder = listdir(LOOKUP_MASK_FOLDER_PATH)
if len(lookupMaskFolder) != 1:
    raise Exception("Please provide exactly one lookup mask")
lookup_mask = iio.imread(LOOKUP_MASK_FOLDER_PATH + lookupMaskFolder[0])
print("Loaded lookup mask")

#masks
MASKS_FOLDER_PATH = "input/masks/"
masksFolder = listdir(MASKS_FOLDER_PATH)
if len(masksFolder) == 0:
    raise Exception("Please provide at least one mask")
masks = [iio.imread(MASKS_FOLDER_PATH + f) for f in masksFolder]
print("Loaded " + str(len(masks)) + " masks")

#animation
ANIMATION_FOLDER_PATH = "input/animation/"
animationFolder = listdir(ANIMATION_FOLDER_PATH)
if len(animationFolder) != 1:
    raise Exception("Please provide exactly one animation")
animation = iio.imread(ANIMATION_FOLDER_PATH + animationFolder[0])
print("Loaded animation")

#%% Create output array
import numpy as np

def colorToString(color):
    return str(color[0]) + str(color[1]) + str(color[2])

def createLookupDict(lookupMask):
    retDict = {}
    for y in range(lookupMask.shape[0]):
        for x in range(lookupMask.shape[1]):
            currColor = lookupMask[y,x,:]
            currColorAsString = colorToString(currColor)
            if int(currColorAsString) != 255255255:
                retDict[currColorAsString] = {"x":x, "y":y}
    return retDict
            

def createMaskedAnimation(animation, lookupDict, mask):
    output = np.full_like(animation, 255)
    colorString = None
    for y in range(output.shape[0]):
        for x in range(output.shape[1]):
            colorString = colorToString(animation[y,x,:])
            if int(colorString) != 255255255:
                lookupPos = lookupDict[colorString]
                for z in range(output.shape[2]):
                    output[y,x,z] = mask[lookupPos["y"], lookupPos["x"], z]
    return output

outputArray = []
lookupDict = createLookupDict(lookupMask=lookup_mask)
for mask in masks:
    outputArray.append(createMaskedAnimation(animation=animation, lookupDict=lookupDict, mask=mask))



# %% Safe output
if len(masksFolder) != len(outputArray):
    raise Exception("Not same amount of masks as output; try rerun")
for counter in range(len(masksFolder)):
    currArr = outputArray[counter]
    iio.imwrite("output/" + "animated_" + masksFolder[counter], currArr)
