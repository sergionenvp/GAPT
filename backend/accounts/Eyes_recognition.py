from accounts.email import create_response
import numpy as np
import os
from PIL import Image
import cv2
import pickle
import keyboard as key
from easygui import *
import time
import pathlib
from django.http import HttpResponse
from rest_framework.response import Response

from rest_framework import status

def trainer():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__)) #Take the path of the directory the actual file 
    image_dir = os.path.join(BASE_DIR, "media/images")  #Create path to the images folder

    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml') #Take the trained AI from the folder classifier that OpenCV framework provides.
    recognizer = cv2.face.LBPHFaceRecognizer_create() #Create the Local Binary Pattern Histogram

    current_id = 0
    label_ids = {}
    x_train = []
    y_labels = []

    for root, dirs, files in os.walk(image_dir): #walk thorugh the images folder
        for file in files:
            if file.endswith("jpg") or file.endswith("jpeg") or file.endswith("png"): #Recognize different types of images
                path = os.path.join(root, file)
                label = file
                print(label)
                if not label in label_ids: #Save the name of the images in a dictionary and also an id
                    label_ids[label] = current_id
                    current_id += 1
                id_ = label_ids[label]
                print(label_ids)

                pil_image = Image.open(path).convert("L") #Convert the image into gray scale
                size = (550, 550)
                final_image = pil_image.resize(size, Image.ANTIALIAS) #Resizethe image to make all of the the same scale
                image_array = np.array(final_image, "uint8") #Turn image into np array
                print(image_array)
                eyes = eye_cascade.detectMultiScale(image_array, 1.3, 6)#Function used to detect eyes

                for x, y, w, h in eyes:
                    roi = image_array[y:y+h, x:x+w] #Take the region of interest from the image (eyes)
                    x_train.append(roi)
                    y_labels.append(id_)

    with open("labels.pickle", 'wb') as f:
        pickle.dump(label_ids, f)

    recognizer.train(x_train, np.array(y_labels)) #Train the AI with the LBPH
    recognizer.save(os.path.dirname(os.path.abspath(__file__)) + "/trainner.yml")#Save it in a file


#def askForPhoto(personId):
 #   capture = cv2.VideoCapture(0)
    #name = enterbox(msg = "Enter your name please: ", title = "Identification")
    #personName = name.lower()
    #if(personName == "" or personName == " "):
     #   exit()
      #  return
   #  photoCounter = 0
   #  msgbox("Show your face clearly, look at the camera and press the SPACEBAR to take the picture.")
   #  while capture.isOpened():
    #     ret, photo = capture.read()
     #    cv2.imshow("Photo", photo)
     #    if cv2.waitKey(30) & 0xFF == ord('q'):
     #        quit()
      #       break

      #   if key.is_pressed('space') and photoCounter == 0: #Press the spacebar to take pohot
      #       path = os.path.dirname(os.path.abspath(__file__)) + "/images/" + str(personId) + "/"
      #       os.makedirs(path)  # Create directory to store the photos.
      #       while (photoCounter < 25):  # Take 50 pictures
       #          index = str(photoCounter)  # Number of photo
                # Write the frame with the face of the person from 1 to 50
       #          cv2.imwrite(path + str(personId) + "_" + index + ".png", photo)
        #         photoCounter += 1
        #         print("photo counter: " + index)
        #     break

   #  capture.release()
   #  cv2.destroyAllWindows()


def identify(image):
    print("1")
    # Take the trained AI from the folder classifier that OpenCV framework provides.
    eye_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + '/haarcascade_eye.xml')
    # Create the Local Binary Pattern Histogram
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    # Read what it has been trained before with the local binary pattern
    recognizer.read(os.path.dirname(
        os.path.abspath(__file__)) + "/trainner.yml")
    # create a dictionary for the labels and their ids
    labels = {"person_name": 1}
    # Open the file which is saving the labels and id for the images
    with open("labels.pickle", 'rb') as f:
        og_labels = pickle.load(f)  # load the dictionary from the file
        # Inverting the id to key and labels to value. Id are uniques
        labels = {v: k for k, v in og_labels.items()}
    # Select the webcam of the device.
    #cap = cv2.VideoCapture(0)
    # Dictionary to save the recognized people by the program
    #person_detected_percentage = {}
    #msgbox("Put your mask on, look at the camera and wait until it identifies you. After 20 seconds the app finishes or press Q to end it.")
    #Start measuring the time
    #start = time.time()
    #while cap.isOpened():  # While the camera is opened

    # Capture the image
    BASE_DIR = os.path.dirname(os.path.abspath(__file__)) #Take the path of the directory the actual file 
    image_dir = os.path.join(BASE_DIR, "image")  #Create path to the images folder
    path = os.path.join(image_dir, image)  #Create path to the images folder
    frame = cv2.imread(path)  # Save the frame (image)

     # Convert the frame into gray. (Helps to the recognition)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      # Detects the eyes thanks to the framework OpenCV. It has alredy trianed AI to detect eyes. Returns a list of tuples with rectangles
    eyes = eye_cascade.detectMultiScale(gray, 1.3, 5)
       # Go over the eyes
       # eyes contains the coordinates x, y and the height h and width w.
    for(x, y, w, h) in eyes:
        # roi: region of interest. Cut the frame showing only the eye
        roi_gray = gray[y:y+h,  x:x+w]
         #roi_color = frame[y:y+h, x:x+w]
        id_, conf = recognizer.predict(roi_gray)
        if(conf >= 120):
            print(id_)
            print(labels[id_])
                # Calculate how many times a person is detected by the AI
            #if not id_ in person_detected_percentage:
             #   person_detected_percentage[id_] = 1
            #else:
                #person_detected_percentage[id_] += 1
                #Write a the name of the person the Ai thinks it is  at each frame
                #font = cv2.FONT_HERSHEY_SIMPLEX
                #name = labels[id_]
                #color = (255, 255, 255)
                #stroke = 2
                #cv2.putText(frame, name, (x, y), font, 1,
                 #           color, stroke, cv2.LINE_AA)
            #Draw a rectagule around the eyes
        img_item = "my-image.png"
        cv2.imwrite(img_item, roi_gray)
        color = (255, 0, 0)
        stroke = 1

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, stroke)
        #Show the actual frame
        #cv2.imshow('frame', frame)
        #If Q is pressed the execution finishes
        #if cv2.waitKey(30) & 0xFF == ord('q'):
         #   break

        #Finish the execution after certain time
        #end = time.time()
        #if end - start > 10:
          #  break

    #cap.release()
    cv2.destroyAllWindows()

    #Calculate the percentage of each person that AI think is showing and trying to be indentified 
    #total = 0
    #for i in person_detected_percentage:
     #   total += person_detected_percentage[i]

    #for e in person_detected_percentage:
     #   person_detected_percentage[e] = person_detected_percentage[e]/total
     #   print(person_detected_percentage[e])

    #print("Total of recognitions: " + str(total))
    #print(person_detected_percentage)
    #print("Max: " + labels[max(person_detected_percentage, key = person_detected_percentage.get)])

    #percentage = person_detected_percentage[max(person_detected_percentage, key = person_detected_percentage.get)] * 100
    #msgbox("The person detected is " + labels[max(person_detected_percentage, key = person_detected_percentage.get)] +
     #     " with a probability of " + str(percentage) + "%")

    #possible_people = []
    #for i in person_detected_percentage:
     #   if person_detected_percentage[i] > 0.20:
      #      possible_people.append(labels[i])

    #if len(possible_people) == 0:
     #   return Response("No person detected", status=400)

    #--------------------------------------------
    #Here there should be a query to the db to get the username from the user id
    #--------------------------------------------

    return str(labels[id_])

def logIn(img):
    trainer()
    return identify(img)

#def signUp(obj):
  #  personId = obj['personId']
    #askForPhoto(personId)
 #   trainer()
#    return identify()

#choices = ["Log in", "Sign up"]
#display = buttonbox("Welcome to the authentication system.", "Authentication", choices)

#if display == choices[0]:
 #   logIn()

#elif display == choices[1]:
 #   signUp()
