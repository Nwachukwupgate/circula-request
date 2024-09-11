import * as Yup from "yup";

const EmailValidation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

export default EmailValidation