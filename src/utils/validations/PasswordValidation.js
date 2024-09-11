import * as Yup from "yup";

const SigninValidation = Yup.object().shape({
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default SigninValidation