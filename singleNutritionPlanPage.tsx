import * as React from "react";
import { NutritionApi } from "../../api/Nutrition";
import { ISingleNutritionPlanEntity, INutritionPlanDirectionEntity } from "../../interfaces/Nutrition";
import * as Moment from "moment";
import { AdminCommentsContainer } from "../comments/adminCommentsContainer";

interface ISingleNutritionPlanState {
    singleNutritionPlan: ISingleNutritionPlanEntity;
}

interface ISingleNutritionProps { } // empty prop to grab the correct id to be sent to public side

export class SingleNutritionPlan extends React.Component<any, ISingleNutritionPlanState> {
    constructor(props) {
        super(props);
        this.state = {
            singleNutritionPlan: {
                fullName: "",
                userBaseId: 0,
                nutritionPlanId: 0,
                planName: "",
                planDetails: "",
                requiredFood: "",
                allergens: "",
                planDirections: [],
                createdById: 0,
                createdDate: new Date(),
                modifiedDate: new Date(),
                isRecommended: false,
                planImageURL: "",
                avatarUrl: "",
                typeDescription: "",
            }
        };
        this.getPlan = this.getPlan.bind(this);

    }

    public componentDidMount() {
        this.getPlan()
    }

    private getPlan() {
        NutritionApi.getByNutritionPlanId(this.props.params.id)
            .then((response) => {
                this.setState({
                    singleNutritionPlan: {
                        fullName: response.item.fullName,
                        userBaseId: response.item.userBaseId,
                        nutritionPlanId: response.item.nutritionPlanId,
                        planName: response.item.planName,
                        planDetails: response.item.planDetails,
                        requiredFood: response.item.requiredFood,
                        allergens: response.item.allergens,
                        planDirections: response.item.planDirections,
                        createdById: response.item.createdById,
                        createdDate: response.item.createdDate,
                        modifiedDate: response.item.modifiedDate,
                        isRecommended: response.item.isRecommended,
                        planImageURL: response.item.planImageURL,
                        avatarUrl: response.item.avatarUrl,
                        stepName: response.item.stepName,
                        directions: response.item.directions,
                        durationTypeId: response.item.durationTypeId,
                        requirements: response.item.requirements,
                        typeName: response.item.typeName,
                        typeDescription: response.item.typeDescription,
                    }
                })

            })
    }
    
    public render() {
        const planImage: React.CSSProperties = {
            backgroundImage: `url(${this.state.singleNutritionPlan.planImageURL})`,
            width: '150px',
            height: '150px',
            backgroundSize: 'cover',
            borderRadius: '15px',
            marginLeft: '80px',
            marginRight: '10px'
        }
        const planText: React.CSSProperties = {
            fontSize: '12px',
            textAlign: 'center'
        }

        return (
            <div key={this.state.singleNutritionPlan.nutritionPlanId}>
                <div className="an-profile-banner" style={{ background: "URL('/assets/img/nutrition/nutritionPlan.jpg')", backgroundSize: "cover" }}>
                    <div className="an-profile-overlay"></div>
                    <div className="an-inner-page-title">
                        <div className="container">
                            <h1 style={{ fontColor: "#FFFFFF" }}>{this.state.singleNutritionPlan.planName}</h1>
                        </div>
                    </div>
                </div>
                <br />

                <div className="an-component-body col-md-6 col-md-offset-3">
                    <div className="an-single-component with-shadow" >
                        <div className="an-user-lists customer-support">
                            <div className="an-lists-body an-customScrollbar" style={{ textAlign: "center" }}>
                                <br />
                                <div className="col-md-5" style={planImage} />
                                <div className="col-md-5" style={{ textAlign: "center" }}>
                                    {this.state.singleNutritionPlan.planDetails}
                                    <br />
                                    <p style={planText}><strong> By: </strong> {this.state.singleNutritionPlan.fullName}
                                        <strong>  On: </strong> {Moment(this.state.singleNutritionPlan.createdDate).format("MM/DD/YYYY")}
                                    </p>
                                    <br />
                                    <p style={{ textAlign: "center" }}>
                                        <strong>Required Food</strong><br />
                                        {this.state.singleNutritionPlan.requiredFood}</p>
                                </div>
                            </div>
                            <div className={"list-user-single"} style={{ alignItems: "center" }}> </div>
                            <div>
                                {this.state.singleNutritionPlan.planDirections.map((itm, i) => {
                                    return (
                                        <div key={i}>
                                            <div className={"list-user-single"}>
                                                <div>
                                                    <h3><strong>{itm.stepName}</strong></h3>
                                                    <strong> Duration:</strong> {itm.durationTypeName}
                                                </div>
                                                <br />
                                                <div>
                                                    <p>
                                                        <strong>Required items for this step:</strong> {itm.requirements}
                                                    </p>
                                                    <div>
                                                        <p>
                                                            <strong> Directions:</strong> {itm.directions}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


