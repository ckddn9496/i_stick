int TrigPin = 12;
int EchoPin = 13;
int LED_PIN = 4;
void setup(){
  Serial.begin(9600);
  pinMode(TrigPin, OUTPUT);
  pinMode(EchoPin, INPUT);
  pinMode(LED_PIN, OUTPUT);
}
 
void loop(){
   unsigned long d;
   digitalWrite(TrigPin, HIGH);
   delayMicroseconds(10); 
   digitalWrite(TrigPin, LOW); 
   d = pulseIn(EchoPin, HIGH)/58.2; /* 센치미터(cm) */
   if(d<=15){
      digitalWrite(LED_PIN, HIGH);
    }
    else{
        digitalWrite(LED_PIN, LOW);}
  
  
}
