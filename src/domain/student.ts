export default class Student {
    constructor(readonly registration: string) {}
  
    static create(props: studentDto) {
      return new Student(props.registration);
    }
  }
  
  export type studentDto = {
    registration: string,
  };