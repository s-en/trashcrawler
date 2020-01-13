start = town
town = string
string "string"
  = chars:char* { return chars.join("") }; 
char = .