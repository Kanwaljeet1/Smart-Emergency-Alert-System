import speech_recognition as sr
import webbrowser
import pyttsx3
import music_library
import requests

recognizer = sr.Recognizer()
engine = pyttsx3.init()
newsapi = "9a0000a17a104d23b7ec2b529b021acb"

def speak(text):
    engine.say(text)
    engine.runAndWait()

def processCommand(c):
    if "open google" in c.lower():
        webbrowser.open("https://google.com")
    elif "open facebook" in c.lower():
        webbrowser.open("https://facebook.com")    
    elif "open youtube" in c.lower():
        webbrowser.open("https://youtube.com")  
    elif "open linkedin" in c.lower():
        webbrowser.open("https://linkedin.com")
    elif c.lower().startswith("play"):
         song = c.lower().split(" ")[1]
         print(song)
         link = music_library.music[song]
         webbrowser.open(link)
    elif "news" in c.lower():
         r = requests.get(f"https://newsapi.org/v2/everything?q=apple&from=2025-05-16&to=2025-05-16&sortBy=popularity&apiKey={newsapi}")
         if r.status_code == 200:
              
            data = r.json()

            articles = data.get('articles', [])
         
            for article in articles:
              speak(article['title'])


if __name__ == "__main__":
       speak(" Hello sir How may I help you ")

       while True:
            r = sr.Recognizer()
            print("recognizing")
            try: 
                    with sr.Microphone() as source:
                        print("listening")
                        audio =r.listen(source,timeout=4, phrase_time_limit=4)
                    word =  r.recognize_google(audio)    
                    if(word.lower()=="jarvis"):
                        speak("yeah") 
                        with sr.Microphone() as source:
                             print("Jarvis Active")
                             audio = r.listen(source)
                             command = r.recognize_google(audio)
                             processCommand(command)
            except Exception as e:
                   print("Error; {0}",format(e))
