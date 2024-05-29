#%%
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
import joblib


gpus = tf.config.list_physical_devices('GPU')
if gpus:
  try:
    tf.config.set_logical_device_configuration(
        gpus[0],
        [tf.config.LogicalDeviceConfiguration(memory_limit=int(1024*1))])
    logical_gpus = tf.config.list_logical_devices('GPU')
    print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
  except RuntimeError as e:
    # Virtual devices must be set before GPUs have been initialized
    print(e)
    print('error when try to use GPU')

#%% Handle data structures
data = pd.read_csv("./data_symptoms/dataset.csv")
df = data.copy()
# Combine all symptom columns into a single column
df['All Symptoms'] = df[df.columns.difference(['Disease'])].apply(lambda row: ','.join(row.dropna()), axis=1)
# Drop duplicate symptoms within each cell
df['All Symptoms'] = df['All Symptoms'].apply(lambda x: ','.join(sorted(set(x.split(','))) if x else ''))
df = df[['All Symptoms', 'Disease']]
dfDisease = df[['Disease']]
dfSymptom = df[['All Symptoms']]
#%%
import re
def strip_to_symptoms_list(text):
    # Remove doble spaces and underscores
    text = re.sub(r'[_\s]+', ' ', text)
    # Split by commas and lowercase it
    symptoms_list = [symptoms_list.strip().lower() for symptoms_list in text.split(',')]
    return symptoms_list

dfSymptom['All Symptoms'] = dfSymptom['All Symptoms'].apply(strip_to_symptoms_list)
# %%
ar = []
for x in dfSymptom['All Symptoms']:
    for ele in x:
        ar.append(ele)
symptoms = list(set(ar))
symptoms.sort()
# print(len(symptoms))
new_cols = pd.DataFrame(columns=symptoms)
dfSymptom = pd.concat([dfSymptom, new_cols], axis=1)
# %% Fill data to each symptom, True if in the column All Symptoms
def fillValue(row):
    for col in new_cols:
        row[col] = False
        if col in row['All Symptoms']:
            row[col] = True
    return row

dfSymptom = dfSymptom.apply(fillValue, axis=1)
# %% Features
X = dfSymptom.drop('All Symptoms', axis=1)
# %% Labels
categories, names = pd.factorize(dfDisease['Disease'])
dfDisease['Disease_encoded'] = categories
NUM_CLASSES = len(names)
y = tf.keras.utils.to_categorical(
    dfDisease['Disease_encoded'], num_classes=NUM_CLASSES
)
# %% Split dataset and convert to tensors
from sklearn.model_selection import train_test_split

X_train_full, X_test, y_train_full, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_valid, y_train, y_valid = train_test_split(X_train_full, y_train_full, test_size=0.2, random_state=42)
# Convert data to tensors
X_train = tf.convert_to_tensor(X_train.values)
X_valid = tf.convert_to_tensor(X_valid.values)
X_test = tf.convert_to_tensor(X_test.values)
y_train = tf.convert_to_tensor(y_train)
y_valid = tf.convert_to_tensor(y_valid)
y_test = tf.convert_to_tensor(y_test)

# %%
METRICS = [
    tf.keras.metrics.Precision(name='precision'),
    tf.keras.metrics.Recall(name='recall'),
    tf.keras.metrics.F1Score(name='f1_score', average='weighted'),
]

CALLBACKS = [
    keras.callbacks.ModelCheckpoint('model_checkpoint.h5', save_best_only=True),
    keras.callbacks.EarlyStopping(monitor='val_recall', mode='max', patience=6, restore_best_weights=True, start_from_epoch=10),
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

def train_model(model, name, train_ds, valid_ds, test_ds, epochs=100, callbacks=CALLBACKS):
    # callbacks.append(tf.keras.callbacks.TensorBoard(log_dir=f"./log/{name}"))
    history = model.fit(
        train_ds[0],
        train_ds[1],
        epochs=epochs,
        callbacks=callbacks,
        validation_data=valid_ds,
        )
    
    model.evaluate(test_ds[0], test_ds[1])
    hisName = name+"history"
    modelName = name+".h5"
    model.save(modelName)
    his = history.history
    joblib.dump(his, hisName)
    return history, hisName, modelName
# %% Define the model
model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Input(shape=[X_train.shape[1]], dtype=tf.float32))
model.add(tf.keras.layers.Dense(300, activation="relu"))
model.add(tf.keras.layers.Dropout(0.3))
model.add(tf.keras.layers.Dense(200, activation="relu"))
model.add(tf.keras.layers.Dropout(0.3))
model.add(tf.keras.layers.Dense(64, activation="relu"))
model.add(tf.keras.layers.Dropout(0.3))
model.add(tf.keras.layers.Dense(NUM_CLASSES, activation="softmax"))
# %% Training the model
predict_disease_model, model_name = make_model(model, "predict_disease_with_symptoms")
history, hisName, modelName = train_model(predict_disease_model, model_name, train_ds=(X_train,y_train), valid_ds=(X_valid, y_valid), test_ds=(X_test, y_test))
# %% Try some predict
# inputs = ['stomach pain','acidity','Chest pain'] # GERD
inputs = ['continuous sneezing','watering from  EYES'] # Allergry

def preprocess_inputs(list, all_columns):
    processed_list = [ele.lower().strip() for ele in list]
    processed_list = [re.sub(r"\s+", " ", element) for element in processed_list]
    print(processed_list)
    preprocessed_inputs = tf.zeros(shape=[all_columns.shape[0]])
    checkInListSymptom = 0
    for i in range(all_columns.shape[0]):
        if all_columns[i] in processed_list:
            checkInListSymptom += 1
            preprocessed_inputs = tf.tensor_scatter_nd_update(preprocessed_inputs, [[i]], [1.0])
    if(checkInListSymptom == len(processed_list)):
        return np.expand_dims(preprocessed_inputs, axis=0)
    else: 
        return None

preprocessed_inputs = preprocess_inputs(inputs, X.columns)
if preprocessed_inputs is None:
    print("Input is not in Symptoms list")
else: 
    predict_proba = predict_disease_model.predict(preprocessed_inputs)
    rs = names[ np.argmax(predict_proba)]
    print(rs, " ",  np.max(predict_proba) * 100)
# %%
