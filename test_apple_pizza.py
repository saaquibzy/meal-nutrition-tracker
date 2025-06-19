from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np

model = load_model('C:/mywish/apple_pizza_model.h5')
img_path = r'C:\mywish\dataset\val\apple\img6.jpeg'

img = load_img(img_path, target_size=(224, 224))
x = img_to_array(img) / 255.0
x = np.expand_dims(x, axis=0)
pred = model.predict(x)
classes = ['apple', 'pizza']  # Make sure this order matches your training folders!
print("Prediction:", classes[np.argmax(pred)])