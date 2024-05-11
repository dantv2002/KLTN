# %% Import libraries
import sys
import os
import tensorflow as tf
from tensorflow import keras
assert tf.__version__ >= "2.0" # TensorFlow ≥2.0 is required
import numpy as np
np.random.seed(42)
tf.random.set_seed(42)
import matplotlib as mpl
import matplotlib.pyplot as plt
import pandas as pd


gpus = tf.config.list_physical_devices('GPU')
if gpus:
  try:
    tf.config.set_logical_device_configuration(
        gpus[0],
        [tf.config.LogicalDeviceConfiguration(memory_limit=int(1024*7))])
    logical_gpus = tf.config.list_logical_devices('GPU')
    print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
  except RuntimeError as e:
    # Virtual devices must be set before GPUs have been initialized
    print(e)
    print('error when try to use GPU')

# %% Create the dataset
data_dir = "./data"
train_dir = data_dir + "/train"
test_dir = data_dir + "/test"

train_split = 0.8
val_split = 0.2
test_split = 1.0

BATCH_SIZE = 32
IMG_HEIGHT, IMG_WIDTH, CHANNEL = 224, 224, 3
IMG_SIZE = (IMG_HEIGHT, IMG_WIDTH)
NUM_CLASSES = 9

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    labels='inferred',
    label_mode='categorical',
    image_size=IMG_SIZE,
    shuffle=True,
    seed=123,
    validation_split=val_split,
    subset='training',
    interpolation='nearest',
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    labels='inferred',
    label_mode='categorical',
    image_size=IMG_SIZE,
    shuffle=True,
    seed=123,
    validation_split=val_split,
    subset='validation',
    interpolation='nearest',
)

test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    test_dir,
    labels='inferred',
    label_mode='categorical',
    image_size=IMG_SIZE,
    shuffle=True,
    seed=123,
    validation_split=None,
    interpolation='nearest',
)

# %% Plot train ds
plt.figure(figsize=(10, 10))
for images, labels in train_ds.take(1):
  for i in range(9):
    ax = plt.subplot(3, 3, i + 1)
    plt.imshow(images[i].numpy().astype("uint8"), cmap='gray')
    plt.title(train_ds.class_names[np.argmax(labels[i])])
    plt.axis("off")
# %% Plot test ds
plt.figure(figsize=(10, 10))
for images, labels in test_ds.take(1):
  for i in range(9):
    ax = plt.subplot(3, 3, i + 1)
    plt.imshow(images[i].numpy().astype("uint8"), cmap='gray')
    plt.title(test_ds.class_names[np.argmax(labels[i])])
    plt.axis("off")
# %%
METRICS = [
    tf.keras.metrics.Precision(name='precision'),
    tf.keras.metrics.Recall(name='recall'),
    tf.keras.metrics.F1Score(name='f1_score', average='weighted'),
]

CALLBACKS = [
    keras.callbacks.ModelCheckpoint('model_checkpoint.h5', save_best_only=True),
    keras.callbacks.EarlyStopping(monitor='val_recall', mode='max', patience=6, restore_best_weights=True),
    keras.callbacks.ReduceLROnPlateau(monitor='val_recall', mode='max', patience=3, factor=0.2),
]

def make_model(model, model_name, metrics=METRICS):
    model.compile(
        optimizer=keras.optimizers.Nadam(learning_rate=1e-3),
        loss=keras.losses.CategoricalCrossentropy(),
        metrics=metrics)
    model.summary()
    tf.keras.utils.plot_model(model, model_name+".png",show_shapes=True)
    return model, model_name

def train_model(model, name, train_ds=train_ds, valid_ds=val_ds, test_ds=test_ds, epochs=100, callbacks=CALLBACKS, batch_size=BATCH_SIZE):
    # callbacks.append(tf.keras.callbacks.TensorBoard(log_dir=f"./log/{name}"))
    history = model.fit(
        train_ds,
        epochs=epochs,
        callbacks=callbacks,
        validation_data=valid_ds,
        batch_size=batch_size)
    
    model.evaluate(test_ds)
    model.save(name+".h5")
    return history

# %% Model alexnet
model = tf.keras.models.Sequential()

# Input layer
model.add(tf.keras.layers.Rescaling(1./255, input_shape=(IMG_HEIGHT, IMG_WIDTH, 3))),
model.add(tf.keras.layers.Conv2D(filters=96, kernel_size=(11, 11), strides=(4, 4), activation="relu"))
model.add(tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2)))
model.add(tf.keras.layers.BatchNormalization())

# Convolutional layers
model.add(tf.keras.layers.Conv2D(filters=256, kernel_size=(5, 5), padding="same", activation="relu"))
model.add(tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2)))
model.add(tf.keras.layers.BatchNormalization())

model.add(tf.keras.layers.Conv2D(filters=384, kernel_size=(3, 3), padding="same", activation="relu"))
model.add(tf.keras.layers.Conv2D(filters=384, kernel_size=(3, 3), padding="same", activation="relu"))
model.add(tf.keras.layers.Conv2D(filters=256, kernel_size=(3, 3), padding="same", activation="relu"))
model.add(tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2)))
model.add(tf.keras.layers.BatchNormalization())

# Fully connected layers
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(2048, activation="relu"))
model.add(tf.keras.layers.Dropout(0.5))
model.add(tf.keras.layers.Dense(1024, activation="relu"))
model.add(tf.keras.layers.Dropout(0.5))
model.add(tf.keras.layers.Dense(NUM_CLASSES, activation="softmax"))

alxnetModel, name = make_model(model, "alexnet")
# %%
historyAlxnetModel = train_model(alxnetModel, name)
# %%
resnet_base = tf.keras.applications.ResNet50(weights='imagenet', include_top=False, input_shape=(IMG_HEIGHT, IMG_WIDTH, 3))

# Freeze the base layers to prevent retraining them (optional)
for layer in resnet_base.layers:
    layer.trainable = True

# Extract features from the base model
x = resnet_base.output

x = tf.keras.layers.Flatten()(x)
x = tf.keras.layers.Dense(2048, activation="relu")(x)
x = tf.keras.layers.Dropout(0.5) (x)
x = tf.keras.layers.Dense(1024, activation="relu") (x)
x = tf.keras.layers.Dropout(0.5) (x)
output = tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')(x)

# Create the final model
model = tf.keras.Model(inputs=resnet_base.input, outputs=output)

resnet50Model, resnet50ModelName = make_model(model, "resnet50")
# %% preprocess img
def resnetPreprocess(img, label, target_height=IMG_HEIGHT, target_width=IMG_WIDTH):
    img = tf.image.resize_with_pad(
        img, 
        target_height, target_width, 
        method=tf.image.ResizeMethod.NEAREST_NEIGHBOR,
        antialias=False
    )
    img = tf.keras.applications.resnet.preprocess_input(img)
    return img, label
resnet_train_ds = train_ds.map(lambda x, y: resnetPreprocess(x, y))
resnet_valid_ds = val_ds.map(lambda x, y: resnetPreprocess(x, y))
resnet_test_ds = test_ds.map(lambda x, y: resnetPreprocess(x, y))

# %%
historyResnet50Model = train_model(resnet50Model, resnet50ModelName, train_ds=resnet_train_ds, valid_ds=val_ds, test_ds=test_ds, batch_size=4)
# %% model like resnet

def conv_block(input_tensor, filters, kernel_size, strides=(1, 1), padding='same'):
    x = tf.keras.layers.Conv2D(filters, kernel_size, strides=strides, padding=padding)(input_tensor)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Activation('relu')(x)
    return x

def identity_block(input_tensor, filters, kernel_size):
    x = conv_block(input_tensor, filters, kernel_size)
    x = tf.keras.layers.Conv2D(filters, kernel_size, padding='same')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Activation('relu')(x)
    x = tf.keras.layers.Add()([x, input_tensor])
    x = tf.keras.layers.Activation('relu')(x)
    return x

def resnet_block(input_tensor, filters, kernel_size, strides=(2, 2)):
    x = conv_block(input_tensor, filters, kernel_size, strides=strides)
    x = tf.keras.layers.Conv2D(filters, kernel_size, padding='same')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    shortcut = tf.keras.layers.Conv2D(filters, (1, 1), strides=strides)(input_tensor)
    shortcut = tf.keras.layers.BatchNormalization()(shortcut)
    x = tf.keras.layers.Add()([x, shortcut])
    x = tf.keras.layers.Activation('relu')(x)
    return x

input_shape=[224, 224, 3]


input_layer = tf.keras.layers.Input(shape=input_shape)
x = tf.keras.layers.Conv2D(64, 7, strides=(2, 2), padding='same')(input_layer)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding='same')(x)

x = resnet_block(x, 64, 3)
x = identity_block(x, 64, 3)
x = identity_block(x, 64, 3)

x = resnet_block(x, 128, 3, strides=(2, 2))
x = identity_block(x, 128, 3)
x = identity_block(x, 128, 3)
x = identity_block(x, 128, 3)

x = resnet_block(x, 256, 3, strides=(2, 2))
x = identity_block(x, 256, 3)
x = identity_block(x, 256, 3)
x = identity_block(x, 256, 3)
x = identity_block(x, 256, 3)
x = identity_block(x, 256, 3)

x = resnet_block(x, 512, 3, strides=(2, 2))
x = identity_block(x, 512, 3)
x = identity_block(x, 512, 3)

x = tf.keras.layers.GlobalAveragePooling2D()(x)
outputs = tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = tf.keras.models.Model(inputs=input_layer, outputs=outputs)

modelResnetCustom, resnetCustomModelName = make_model(model, "modelResnetCustom")
# %%
historyResnetCustom = train_model(modelResnetCustom, resnetCustomModelName, train_ds=resnet_train_ds, valid_ds=resnet_valid_ds, test_ds=resnet_test_ds, batch_size=20)
# Try prediction:
# if 10: 
#     plt.figure(figsize=(12, 80))
#     index = 0
#     test_set_raw = test_set_raw.shuffle(buffer_size=50)
#     for image, label in test_set_raw.take(30):
#         index += 1
#         plt.subplot(15, 2, index)
#         plt.imshow(image)

#         test_img, label = preprocess(image, label)
#         #with tf.device('/cpu'):
#         prediction =  model(test_img, training=False) 
#         prediction_lbl = np.argmax(prediction.numpy())
#         prediction_score = np.max(prediction.numpy())

#         plt.title("Label: {} \nTop-1 predict: {} ({}%)".format(class_names[label],class_names[prediction_lbl], round(prediction_score*100,1)), fontsize=20)
#         plt.axis("off")

# %%
