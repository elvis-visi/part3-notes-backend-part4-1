//imports the function to be tested 
const reverse = require('../utils/for_testing').reverse

//Individual test cases are defined with the test function.

//The first parameter of the function is the test description as a string.
// The second parameter is a function, that defines the functionality for 
//the test case
test('reverse of a', () => {
    const result = reverse('a')

    expect(result).toBe('a')

})

//First, we execute the code to be tested, meaning that we generate a reverse for the string react. 
//Next, we verify the results with the expect function. 
test('reverse of react', () => {
    const result = reverse('react')
  //
    expect(result).toBe('tcaer')
  })

  test('reverse of releveler', () => {
    const result = reverse('releveler')
  
    expect(result).toBe('releveler')
  })


