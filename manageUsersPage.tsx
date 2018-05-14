import * as React from "react";
import { UserApi } from "../../api/users";
import { IManageUsersEntity, IManageUsersAccountEntity, IManageSortPageEntity } from "../../interfaces/manageUsers";
import { ManageUsersList, ManageRolesModal } from "../manageUsers";
import { Button, RadioButtonList, Input } from "../../common/components/form";
import * as Moment from "moment";

interface IManageUsersState {
    userInfos: IManageUsersEntity[];
    manageUsersEntity: IManageUsersEntity;
    sortPageEntity: IManageSortPageEntity;
    showModal: boolean;
    selectedValue: any;
    currentPage: number;
    totalPages: number;
}
export class ManageUsersPage extends React.Component<{}, IManageUsersState> {
    constructor(props) {
        super(props);
        this.state = {
            manageUsersEntity: {
                id: 0,
                firstName: "",
                lastName: "",
                email: "",
                roleName: "",
                appRoleId: 0,
                createdDate: new Date,
                isAccountLocked: false
            },
            sortPageEntity: {
                columnName: "",
                pageNumber: 1,
                sortOrder: false,
                recordsPerPage: 20, //this number can be changed to how many users you want to display per page
                input: ""
            },
            currentPage: 1,
            totalPages: 1,
            userInfos: [],
            showModal: false,
            selectedValue: false
        }
        this.onSaveNewRole = this.onSaveNewRole.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.getById = this.getById.bind(this);
        this.modalToggle = this.modalToggle.bind(this);
        this.onHeaderClick = this.onHeaderClick.bind(this);
        this.onToggleAccount = this.onToggleAccount.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.getArrowDirection = this.getArrowDirection.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }
    private onFieldChange(fieldName: any, selectedValue: any) {
        const nextState = {
            ...this.state,
            manageUsersEntity: {
                ...this.state.manageUsersEntity,
                [fieldName]: selectedValue
            }
        }
        this.setState(nextState);
    }

    //function to handle the search bar
    public onSearch(fieldName: string, fieldValue: any) {
        switch (fieldName) {
            case "search":
                const nextState = {
                    ...this.state,
                    sortPageEntity: {
                        ...this.state.sortPageEntity,
                        input: fieldValue,
                        pageNumber: 1
                    }
                }
                this.setState(nextState);
                //this.getAllUsers();
                if (fieldValue == "") {
                    this.setState({
                        sortPageEntity: {
                            pageNumber: 1,
                            recordsPerPage: 20,
                            input: "",
                            columnName: "test",
                            sortOrder: false,
                        }
                    }, () => { this.getAllUsers() });
                }
                break;
        }
    }
    //created in order for modal to pop up/close
    private modalToggle() {
        this.setState({ showModal: !this.state.showModal })
    }
    public componentDidMount() {
        document.title = "Team Prospect/Manage Users";
        //firing get ALL users call when the page loads
        this.getAllUsers();
    }
    //"get by id" -- when you click on the modal it'll have the selected value 
    //and current user's id for the selected modal
    private getById(id, action) {
        UserApi.getManageUsers()
            .then((response) => {
                this.setState({
                    ...this.state,
                    manageUsersEntity: {
                        ...this.state.manageUsersEntity,
                        id: id,
                        appRoleId: action,
                    },
                    showModal: true
                });
            })
            .catch((err) => { });
    }
    //get call for all users, pagination, & sorting
    private getAllUsers() {
        UserApi.sortUsers(this.state.sortPageEntity)
            .then((response) => {
                if (response.items.length > 0) {
                    this.setState({
                        userInfos: response.items,
                        totalPages: response.items[0].totalPages })
                } else {
                    this.setState({ userInfos: response.items, totalPages: 0 })
                }
            })
            .catch((err) => { });
    }
    private getArrowDirection(direction: number) { // function for direction of the pagination
        let newPage = this.state.currentPage + direction;
        this.setState({
            currentPage: newPage
        }),
            this.setState({
                sortPageEntity: {
                    ...this.state.sortPageEntity,
                    pageNumber: newPage
                }
            }, () => { this.getAllUsers() });
    }

    public nextPage(page: number) { //function for page number for pagination
        this.setState({
            currentPage: page
        }),
            this.setState({
                sortPageEntity: {
                    ...this.state.sortPageEntity,
                    pageNumber: page
                }
            }, () => { this.getAllUsers() });

    }

    public onHeaderClick(columnName: string) { //put sorting function in here
        this.setState({
            ...this.state,
            sortPageEntity: {
                ...this.state.sortPageEntity, //upon clicking header name it will sort for you -- default sorting will be by created date
                columnName: columnName,
                sortOrder: !this.state.sortPageEntity.sortOrder
            }
        }, () => {
            this.getAllUsers();
        });
    }
    //edit user's roles
    private onSaveNewRole() {
        this.setState({
            showModal: false
        })
        UserApi.manageUsersRoles(this.state.manageUsersEntity)
            .then((response) => {
                this.getAllUsers();
            })
            .catch((err) => { });
    }
    //locking and unlocking user's account
    public onToggleAccount(lockId: number, action: boolean) {
        UserApi.isAccountLocked({ id: lockId, isAccountLocked: action })
            .then((response) => {
                this.getAllUsers();
            })
            .catch((err) => { })
    }

    public render() {
        var pagesArray = [];
        if (this.state.sortPageEntity.input !== "") { // if we are searching this will count how many is in the array and divide it by 20. 20 because that's how much we want to show per page
            var pageCount = Math.ceil(this.state.userInfos.length / 20)
        } else {
            var pageCount = this.state.totalPages
        }
        for (var i = 1; i <= pageCount; i++) {
            pagesArray.push(i); // if we are not searching it will return the total number of users
        }
        const disabled: React.CSSProperties = {
            pointerEvents: 'none'
        };
        const enabled: React.CSSProperties = {}
        const changeColor: React.CSSProperties = {
            background: '#333',
            color: '#ffcc33'
        }
        const maxPage = this.state.currentPage >= this.state.totalPages;
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <br />
                            <div className="form-inline" style={{ marginLeft:"15px" }}>
                                <Input type="search" name="search" onEnter={this.getAllUsers} value={this.state.sortPageEntity.input} onChange={this.onSearch} placeholder="Search Users">
                            </Input>
                            <button className="an-btn-small an-btn-prospect" style={{ left: 10, top: 5 }} type="button" onClick={this.getAllUsers}>Search</button>
                       </div>
                    </div>
                </div>
                <div className="an-page-container">
                    <div className="container">
                        <ManageRolesModal
                            showModal={this.state.showModal}
                            onClose={this.modalToggle}>
                            <form style={{ textAlign: "center" }}>
                                <RadioButtonList
                                    name="appRoleId"
                                    label="Role"
                                    onChange={this.onFieldChange}
                                    selectedValue={this.state.manageUsersEntity.appRoleId}
                                    options={[ //hard coded the values for roles
                                        { key: "1", value: "Admin" },
                                        { key: "2", value: "Fan" },
                                        { key: "3", value: "Prospect" },
                                        { key: "4", value: "ThirdParty" },
                                        { key: "5", value: "Moderator" }
                                    ]}
                                />
                                <Button
                                    className="an-btn-small an-btn-prospect-transparent"
                                    label="Save"
                                    disabled={false}
                                    onClick={this.onSaveNewRole} />
                            </form>
                        </ManageRolesModal>
                        <ManageUsersList
                            dataItems={this.state.userInfos}
                            showEditButton={true}
                            showDeleteButton={true}
                            onButtonClick={this.getById}
                            onLock={this.onToggleAccount}
                            onHeaderClick={this.onHeaderClick}
                            headerColumns={[
                                { columnName: "Lock", columnStyle: "basis-10" },
                                { columnName: "First Name", columnStyle: "basis-20" },
                                { columnName: "Last Name", columnStyle: "basis-20" },
                                { columnName: "Email", columnStyle: "basis-30" },
                                { columnName: "Role", columnStyle: "basis-10" },
                                { columnName: "Created Date", columnStyle: "basis-30" }]}
                        />
                    </div>
                        {/**********************  Pagination  **************************/}
                        <div className="an-pagination-container center">
                            <ul className="pagination">
                                <li>
                                    <a href="javascript:;" aria-label="Previous" style={this.state.currentPage <= 1 ? disabled : enabled}
                                        onClick={(e) => {
                                            this.getArrowDirection(-1);
                                            return false;
                                        }}>
                                        <span aria-hidden="true"><i className="ion-chevron-left"></i></span>
                                    </a>
                                </li>
                                {pagesArray.map((page, index) => {
                                    return (
                                        <li key={index}>
                                            <a href="javascript:;" style={page == this.state.sortPageEntity.pageNumber ? changeColor : enabled}
                                                onClick={(e) => {
                                                    this.nextPage(page);
                                                    return false;
                                                }}>{page}</a>
                                        </li>
                                    )
                                })}
                                <li>
                                    <a href="javascript:;" aria-label="Next" style={maxPage ? disabled : enabled}
                                        onClick={(e) => {
                                            this.getArrowDirection(1);
                                            return false;
                                        }}>
                                        <span aria-hidden="true"><i className="ion-chevron-right"></i></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/**********************  Pagination  **************************/}
                    </div>
                </div>
            </div>
        )
    }
}