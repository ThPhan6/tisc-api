# command line arguments
import sys

image = sys.argv[1];

#Clustering algorithm to separate out clusters in our case colours
from sklearn.cluster import KMeans

#plotting graphs and images
import matplotlib.pyplot as plt


#process images as numpy arrays
import numpy as np
import base64


#image processing library OpenCV
import cv2

#It is an unordered collection where elements are stored as dictionary keys and
#their counts are stored as dictionary values.
from collections import Counter

#Convert image respresentations
from skimage.color import rgb2lab, deltaE_cie76

#loading images
import os

#sets the backend of matplotlib to the 'inline' backend: With this backend,
#the output of plotting commands is displayed inline within frontends like the Jupyter notebook
# %matplotlib inline

def colorToHex(color):
    #{:02x} print atleast 2 digits of hex code for a channel
    return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))

# function to read an image into RGB space

def read_image(base64_string):
    # sbuf = StringIO()
    # sbuf.write(base64.b64decode(base64_string.encode('ascii')))
    # pimg = Image.open(sbuf)
    # return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
    #reading in the image into a numpy array
    decoded_data = base64.b64decode(base64_string)
    np_data = np.fromstring(decoded_data, np.uint8)
    img = cv2.imdecode(np_data,cv2.IMREAD_UNCHANGED)
    #
    # #convert the channels to RGB using cv2.cvtColor function
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

# fetch colors from image and display as a pie chart distribution
# arguments => image, count of top colors, display_chart

def fetch_colors(image, color_count, display_chart):
    #KMeans expects the input to be of two dimensions,
    #so we use Numpy’s reshape function to reshape the image data.

    modified_image = image.reshape(image.shape[0]*image.shape[1], 3)

    #color clusters
    clf = KMeans(n_clusters = color_count)

    #fit the model and extract the prediction into the variable predictions
    predictions = clf.fit_predict(modified_image)

    #create a collection of count of colors
    counts = Counter(predictions)

    center_colors = clf.cluster_centers_

    #fetch ordered colors by iterating through the keys
    ordered_colors = [center_colors[i] for i in counts.keys()]
    hex_colors = [colorToHex(ordered_colors[i]) for i in counts.keys()]
    rgb_colors = [ordered_colors[i] for i in counts.keys()]

    #if display_chart is true, plot pie chart
    if (display_chart):
        plt.figure(figsize = (8, 6))
        plt.pie(counts.values(), labels = hex_colors, colors = hex_colors)

    return counts, hex_colors,center_colors, predictions


loaded_image = read_image(image)
color_count = 10
display_chart  = True
colors_fetched_counts, colors_fetched, center_colors, predictions = fetch_colors(loaded_image, color_count, display_chart)

result = {}
for i in colors_fetched_counts.keys():
    result[colors_fetched[i]] = colors_fetched_counts[i]

print(result)
