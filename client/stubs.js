const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
  cout<<"Hello world!\\n";
  return 0;
}
`;
stubs.c = `#include <stdio.h>
 
int main()
{
 
    // prints hello world
    printf("Hello World");
 
    return 0;
}`;
stubs.java = `class Code
{
    public static void main(String []args)
    {
        System.out.println("My First Java Program.");
    }
}`;

stubs.py = `print("Hello world!")`;

stubs.js = `console.log("Hello world!")`;

export default stubs;