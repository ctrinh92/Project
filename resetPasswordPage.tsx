import * as React from "react";
import { Link, browserHistory } from "react-router";
import { UserApi } from "../../api/users";
import { Button, Input } from "../../common/components/form";
import { IResetPassEntity, IResetPassForm } from "../../interfaces/register";
import { IError, IInputProps } from "../../interfaces";
import { Validation } from "../../common/components/Validation";
import * as toastr from "toastr";
import { ForgotPasswordPage } from "../../components/register";

interface IPasswordErrors {
    newPassword: string,
    confirmPassword: string,
}

interface IResetPasswordState {
    resetPassword: IResetPassEntity;
    formErrors: IPasswordErrors;
    isFormValid: boolean;
    isPasswordValid: boolean;
    isConfirmPasswordValid: boolean;
    isValidToken: boolean;
}

export class ResetPasswordPage extends React.Component<any, IResetPasswordState> {
    constructor(props) {
        super(props);
        this.state = {
            resetPassword: {
                newPassword: "",
                confirmPassword: "",
                token: props.params.Token,
            },
            isFormValid: false,
            isPasswordValid: false,
            isConfirmPasswordValid: false,
            formErrors: {
                newPassword: "",
                confirmPassword: "",
            },
            isValidToken: false
        };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    private onBlur(fieldName: string, fieldValue: string) {
        const nextState = {
            resetPassword: {
                ...this.state.resetPassword,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState, () => { this.validateField(fieldName, fieldValue) });
    };

    private onFieldChange(fieldName: string, fieldValue: string) {
        const nextState = {
            ...this.state,
            resetPassword: {
                ...this.state.resetPassword,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState, () => { this.validateField(fieldName, fieldValue) });
    }

    private validateField(fieldName: string, fieldValue: any) {
        let errorMessage = this.state.formErrors;
        let isPasswordValid = this.state.isPasswordValid;
        let isConfirmPasswordValid = this.state.isConfirmPasswordValid;
        switch (fieldName) {
            case "newPassword":
                let passwordErrMsg: IError = Validation.validatePassword(fieldValue);
                isPasswordValid = !passwordErrMsg.isNotValid;
                errorMessage.newPassword = passwordErrMsg.errMsg;
                break;
            case "confirmPassword":
                if (this.state.resetPassword.confirmPassword == this.state.resetPassword.newPassword) {
                    isConfirmPasswordValid = true;
                    errorMessage.confirmPassword = ""
                } else {
                    isConfirmPasswordValid = false;
                    errorMessage.confirmPassword = "Passwords do not match"
                }
                break;
            default: false;
        }
        this.setState({
            formErrors: errorMessage,
            isPasswordValid: isPasswordValid,
            isConfirmPasswordValid: isConfirmPasswordValid

        }, this.validateForm);
    }
    private validateForm() {
        this.setState({ isFormValid: this.state.isPasswordValid && this.state.isConfirmPasswordValid });
    }

    public componentDidMount() {
        //const token = this.props.params.Token;
        UserApi.validateToken(this.state.resetPassword)
            .then((response) => {
                this.setState({ isValidToken: response.item })
                if (!response.item) { /*toastr.error("Token not valid");*/ }
            }, (err) => {
            })
            .catch((err) => {
            });
    }

    private onSave() {
        if (this.state.isFormValid) {
            UserApi.resetPassword(this.state.resetPassword)
                .then((response) => {
                    { browserHistory.push("/home/login") }
                })
                .catch((err) => {

                })
        }
    }

    public render() {
        if (this.state.isValidToken) {
            return (
                //if true token AKA guid is valid show form to reset new password
                <div className="container">
                    <div className="row">
                        <div className="col-sm-offset-3 col-sm-6">
                            <form className="tg-loginform" method="post">
                                <fieldset>
                                    <div className="form-group">
                                        <Input
                                            type="password"
                                            placeholder="New Password"
                                            name="newPassword"
                                            label="New Password"
                                            onChange={this.onFieldChange}
                                            onBlur={this.onBlur}
                                            error={this.state.formErrors.newPassword}
                                            value={this.state.resetPassword.newPassword}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            onChange={this.onFieldChange}
                                            onBlur={this.onBlur}
                                            error={this.state.formErrors.confirmPassword}
                                            value={this.state.resetPassword.confirmPassword}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <Button
                                            className="tg-btn tg-btn-lg"
                                            label="Submit"
                                            disabled={!this.state.isFormValid}
                                            onClick={this.onSave}
                                        />
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            )
            // else if guid is NOT true/expired route to forgot password page
        } else {
            return (
                <div style={{ paddingTop: "40px", paddingBottom: "20px" }}>
                    <h3 style={{ textAlign: "center" }}>Your link has expired. Please enter your email to get a new link.</h3>
                    <ForgotPasswordPage />
                </div>
            )
        }


    }
}