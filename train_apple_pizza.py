import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# Paths to your data
train_dir = 'C:/mywish/dataset/train'
val_dir = 'C:/mywish/dataset/val'
img_size = (224, 224)
batch_size = 16

# Data generators
train_gen = ImageDataGenerator(rescale=1./255, horizontal_flip=True, zoom_range=0.2)
val_gen = ImageDataGenerator(rescale=1./255)

train_data = train_gen.flow_from_directory(
    train_dir, target_size=img_size, batch_size=batch_size, class_mode='categorical'
)
val_data = val_gen.flow_from_directory(
    val_dir, target_size=img_size, batch_size=batch_size, class_mode='categorical'
)

# Model setup
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=img_size + (3,))
base_model.trainable = False

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(train_data.num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train
history = model.fit(train_data, validation_data=val_data, epochs=8)

# Plot accuracy
plt.plot(history.history['accuracy'], label='train acc')
plt.plot(history.history['val_accuracy'], label='val acc')
plt.legend()
plt.show()

# Save the model
model.save('apple_pizza_model.h5')
print("Training complete! Model saved as apple_pizza_model.h5")