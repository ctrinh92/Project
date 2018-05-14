import * as React from "react";
import { UserApi } from "../../api/users";
import { Link, browserHistory } from "react-router";
import { Button, Input, Password } from "../../common/components/form";
import { IForgotPassEntity, IForgotPassForm } from "../../interfaces/register";
import { IError, IInputProps } from "../../interfaces";
import { Validation } from "../../common/components/Validation";
import * as toastr from "toastr";
import { ModalWindow } from "../../common/components/modal";

interface IForgotPasswordState {
    forgotPassword: IForgotPassEntity;
    successModal: boolean;
    errorModal: boolean;
    resetPasswordSuccess: boolean;
}

export class ForgotPasswordPage extends React.Component<{}, IForgotPasswordState> {
    constructor(props) {
        super(props);
        this.state = {
            forgotPassword: {
                Email: "",
                AppTokenTypeId: 2,
                Token: ""
            },
            successModal: false,
            errorModal: false,
            resetPasswordSuccess: false
        }
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.modalToggle = this.modalToggle.bind(this);
        this.errorToggle = this.errorToggle.bind(this);
        
    }

    private onBlur(fieldName: string, fieldValue: string) {
        const nextState = {
            forgotPassword: {
                ...this.state.forgotPassword,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState);
    };

    private onFieldChange(fieldName: string, fieldValue: string) {
        const nextState = {
            ...this.state,
            forgotPassword: {
                ...this.state.forgotPassword,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState);
    }

    //checks to see if email is validated - if valid = send email link and show pw reset form
    private onSave() {
        UserApi.forgotPassword(this.state.forgotPassword)
            .then((response) => {
                if (response.item == "success") {
                    this.setState({
                        resetPasswordSuccess: true
                    })
                }
                this.modalToggle();
            }, (err) => {
                this.errorToggle();
            })
            .catch((err) => {
                this.errorToggle();
            });
    }
    
    private modalToggle() {
        if (this.state.errorModal == false) {
            this.setState({ successModal: !this.state.successModal }, () => {
                this.setState({
                    forgotPassword: {
                        ...this.state.forgotPassword,
                        Email: ""
                    }
                })});
            
        }
    }
    public errorToggle() {
        if (this.state.successModal == false) {
        this.setState({ errorModal: !this.state.errorModal })
        }
       
    }

    private successModal() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Please check your email for a verification link.</h3>
                <br />
            </div>
        )
    }

    private errorModal() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Please enter a Valid Email.</h3>
                <br />
            </div>
        )
    }

    public render() {
        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-offset-3 col-sm-6">
                        <form className="tg-loginform" method="post">
                            <fieldset>
                                <div className="form-group">
                                    <Input
                                        type="email"
                                        label="Email"
                                        name="Email"
                                        value={this.state.forgotPassword.Email}
                                        onChange={this.onFieldChange}
                                        placeholder="Email"
                                        onBlur={this.onBlur} />
                                </div>
                                <div className="form-group">
                                    <Button
                                        className="tg-btn tg-btn-lg"
                                        onClick={this.onSave}
                                        disabled={false}
                                        label="Reset Password" />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <ModalWindow
                showModal={this.state.successModal}
                onClose={this.modalToggle}>
                {this.successModal()}
            </ModalWindow>
            <ModalWindow
                showModal={this.state.errorModal}
                onClose={this.errorToggle}>
                {this.errorModal()}
            </ModalWindow>
           </div>
        )
    }
}