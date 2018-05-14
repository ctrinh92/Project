import * as React from "react";
import { IKeyValue, IDropDownListProps } from "../../../interfaces";
import { EventApi } from "../../../api/Events";
import { UserApi } from "../../../api/users";
import { DropDownList, Button } from "../form";


export interface IEventAttendance { //PROP
    eventId: number,
    attendance?: string
}

export interface IEventState { //STATE
    eventEntity: {
        eventId: number,
        attendance: string,
    },
    selectedValue: any
}

const buttonStyle = {
    position: "relative",
    fontSize: "12px",
    padding: "05px",
    textAlign: "center",
    bottom: "5px",
    left: "10px",
   
} as React.CSSProperties


export class EventAttendance extends React.Component<IEventAttendance, IEventState> {
    constructor(props) {
        super(props);
        this.state = {
            eventEntity: {
                eventId: this.props.eventId, // need to initialize state as prop eventId
                attendance: this.props.attendance,
            },
            selectedValue: false,
        }
        this.onSaveEventAttendance = this.onSaveEventAttendance.bind(this);
        this.onDropChange = this.onDropChange.bind(this);
    }

    public componentWillReceiveProps(nextProps) {
        if (this.props.eventId != nextProps.eventId) {
            this.setState({
                ...this.state,
                eventEntity: {
                    attendance: nextProps.attendance,
                    eventId: nextProps.eventId
                }
            })
          
        }
    }

    
    private onDropChange(fieldName: string, fieldValue: any) {
        const nextState = {
            ...this.state,
            eventEntity: {
                ...this.state.eventEntity,
                attendance: fieldValue
            }
        }
        this.setState(nextState);
    }

    private onSaveEventAttendance() { //api call to send back eventID and attedance answer --- post
        EventApi.eventAttendance(this.state.eventEntity)
            .then((response) => {
            })
    }

    public render() {
        return (
            <div style={{
                width: "200px", fontSize: "13px", /*padding: "6px 10px", left: "10px"*/
            }}>
                <form className="form-inline">
                    <DropDownList
                        label="Going:"
                        name="Attendance"
                        selectedValue={this.state.eventEntity.attendance}
                        onChange={this.onDropChange}
                        options={[
                            //hardcoded our options
                            { key: "Yes", value: "Yes" },
                            { key: "No", value: "No" },
                            { key: "Maybe", value: "Maybe" }
                        ]} />
                    <Button
                        className="an-btn an-btn-prospect rounded"
                        style={buttonStyle}
                        label="Save"
                        disabled={false}
                        onClick={this.onSaveEventAttendance} />
                </form>
            </div>
        )
    }
}

/*
TEST --- THIS IS HOW YOU WOULD USE THIS COMPONENT. YOU JUST NEED TO PASS IN THE EVENT ID AND YOU'RE GOOD TO GO  

<EventAttendance eventId={itm.eventId}/> 


*/