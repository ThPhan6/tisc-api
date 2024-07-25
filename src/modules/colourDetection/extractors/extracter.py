import scipy.cluster
import sklearn.cluster
import numpy
import base64
from PIL import Image
from io import StringIO
from io import BytesIO
import sys

# function to conver rgb color to hexadecimal code
def colorToHex(color):
    #{:02x} print atleast 2 digits of hex code for a channel
    return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))

# function to read an image into RGB space
def read_image(base64_string):
    img = Image.open(base64_string);
    return img.convert('RGB');
    # sbuf = StringIO();
    # imgdata = base64.b64decode(str(base64_string));
    # img = Image.open(BytesIO(imgdata));
    # # convert to RGB color spaces
    # return img.convert('RGB');

# PIL image input
def dominant_colors(image):
    resized_image = image.resize((150, 150)) # to reduce time
    ar = numpy.asarray(resized_image)
    shape = ar.shape
    ar = ar.reshape(numpy.product(shape[:2]), shape[2]).astype(float)

    kmeans = sklearn.cluster.MiniBatchKMeans(
        n_clusters=3,
        init="k-means++",
        max_iter=20,
        random_state=1000
    ).fit(ar)
    codes = kmeans.cluster_centers_

    vecs, _dist = scipy.cluster.vq.vq(ar, codes)         # assign codes
    counts, _bins = numpy.histogram(vecs, len(codes))    # count occurrences
    # ;
    colors = {}
    for index in numpy.argsort(counts)[::-1]:
        hexColor = colorToHex(tuple([int(code) for code in codes[index]]));
        if hexColor in colors:
            colors[hexColor] += counts[index]
        else:
            colors[hexColor] = counts[index]
    # returns colors in order of dominance
    return colors

# image base64 is second agr
image_path = sys.argv[1];
# load image from base64
loaded_image = read_image(image_path);
# get colors in order of dominance
colors = dominant_colors(loaded_image);
# return output
print(colors);
