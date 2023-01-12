import { useContext, useEffect, useState } from "react"
import "../styles/adminDashboard.scss"
import "../styles/pageStyle.scss"
import { AppContext } from "../App"
import Popup from 'reactjs-popup'
import  Dropdown  from "react-dropdown"
import axios from 'axios'
import { useClickInside } from "../hooks/useClickInside"

const AdminDashboard = () => {
    const {setUsers, setDevicesForAllUsers} = useContext(AppContext)
    const [nameValue, setNameValue] = useState("")
    const [usersChanged, setUsersChanged] = useState(true)
    const [allUsers, setAllUsers] = useState(null)
    const [allDevices, setAllDevices] = useState(null)
    const [popupOn, setPopupOn] = useState(false)
    const [emailValue, setEmailValue] = useState("")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [addressValue, setAddressValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [maxEnConsValue, setMaxEnConsValue] = useState("")
    const [currentRow, setCurrentRow] = useState(null)
    const [currentDevice, setCurrentDevice] = useState(null)
    const [updatePopupOn, setUpdatePopupOn] = useState(false)
    const [devicePopup, setDevicePopup] = useState(false)
    const [addDeviceToUserPopup, setAddDeviceToUserPopup] = useState(false)
    const [role, setRole] = useState("")
    const [devices, setDevices] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)

    const ref = useClickInside(() => {
        setPopupOn(false);
        setUpdatePopupOn(false)
        setAddDeviceToUserPopup(false)
        setDevicePopup(false)
      });

    const ROLES = [
        "administrator",
        "user"
    ]
    const onEmailChanged = (e) => {
        setEmailValue(e.target.value);
    }

    const onPasswordChanged = (e) => {
        setPasswordValue(e.target.value);
    }

    const onNameChanged = (e) => {
        setNameValue(e.target.value);
    }

    const onDescriptionChanged = (e) => {
        setDescriptionValue(e.target.value);
    }

    const onAddressChanged = (e) => {
        setAddressValue(e.target.value);
    }

    const onMaxEnChanged = (e) => {
        setMaxEnConsValue(e.target.value);
    }

    useEffect(() => {
        (async () => getUsers())()
    },[usersChanged])

    useEffect(() => {
        (async () => getDevices())()
    },[])

    const getUsers = async () => {
        try{
        const users = await axios.get(`http://localhost:8083/Administrator`)
        setUsers(JSON.stringify(users.data))
        setAllUsers(JSON.parse(localStorage.getItem("users")))
        } catch (error) {
            console.log("error")
        }
    }

    const getDevices = async () => {
        try{
            const devices = await axios.get(`http://localhost:8083/Administrator/GetDevices/`)
            setDevicesForAllUsers(JSON.stringify(devices.data))
            setAllDevices(JSON.parse(localStorage.getItem("allDevices")))
        }catch(err){
            console.log(err)
        }
    }

    const onRowClicked=(e,val) => {
        setCurrentRow(val)
        setPopupOn(true)
    }

    const onDeviceClicked = (e,val) => {
        setCurrentDevice(val)
        setDevicePopup(true)
    }

    const tableOfUsers = () => {
        return(
        <table className="table" >
            <thead>
            <tr className="table-tr">
                <th className="table-th">
                <b>Name</b>
                </th>
                <th className="table-th">
                <b>Email</b>
                </th>
                <th className="table-th">
                <b>Role</b>
                </th>
            </tr>
            </thead>
            <tbody className="table-body">
            {allUsers?.map((val, key) => {
                return (
                <tr key={key} onClick = {(e) => onRowClicked(e,val)}>
                    <td className="table-td">{val.name}</td>
                    <td className="table-td">{val.email}</td>
                    <td className="table-td">{val.role}</td>
                </tr>
                );

                })}
            </tbody>
        </table>
        )
    }

    const tableOfDevices = () => {
        return(
        <table className="table" >
            <thead>
            <tr className="table-tr">
                <th className="table-th">
                <b>Description</b>
                </th>
                <th className="table-th">
                <b>Address</b>
                </th>
                <th className="table-th">
                <b>Max Energy Consumption</b>
                </th>
            </tr>
            </thead>
            <tbody className="table-body">
            {allDevices?.map((val, key) => {
                return (
                <tr key={key} onClick = {(e) => onDeviceClicked(e,val)}>
                    <td className="table-td">{val.description}</td>
                    <td className="table-td">{val.address}</td>
                    <td className="table-td">{val.maximumEnergyConsumption}</td>
                </tr>
                );

                })}
            </tbody>
        </table>
        )
    }

    const usersTable = () => {
        if(allUsers?.length){
            return tableOfUsers()
        }
    }

    const devicesTable = () => {
        if(allDevices?.length){
            return tableOfDevices()
        }
    }

    const onAddClicked = async () => {
        const newUser = {
            name: nameValue,
            role: role,
            email: emailValue,
            password: passwordValue,
            salt: "salt"
        }
        await axios.post(`http://localhost:8083/Administrator/AddUser`, newUser).then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          });
          setUsersChanged(!usersChanged)
    }

    const onAddDeviceClicked = async () => {
        const newDevice = {
            description: descriptionValue,
            address: addressValue,
            maximumEnergyConsumption: maxEnConsValue
        }
        await axios.post(`http://localhost:8083/Administrator/AddDevice`, newDevice)
    }

    const onDropdownChange = (e) => {
        setRole(e.value)
    }

    const onUpdateBtnClicked = () => {
        setPopupOn(false)
        setUpdatePopupOn(true)
    }

    const onUpdateClicked = async () => {
        const newUser = {
            id: currentRow.id,
            name: nameValue,
            role: role,
            email: emailValue,
            password: passwordValue,
            salt: "salt"
        }
        try{
            await axios.put(`http://localhost:8083/Administrator/UpdateUser`, newUser).then((response) => {
                console.log(response);
              }, (error) => {
                console.log(error);
              });
        } catch (error) {
            console.log("error")
        }
        setUsersChanged(!usersChanged)
    }

    const onDeleteClicked = async() => {
        try{
            await axios.delete(`http://localhost:8083/Administrator/DeleteUser/${parseInt(currentRow.id)}`)
        } catch (error) {
            console.log("error")
        }
        setUsersChanged(!usersChanged)
        setPopupOn(false)
    }

    const onDeleteDeviceClicked = async() => {
        try{
            await axios.delete(`http://localhost:8083/Administrator/DeleteDevice/${parseInt(currentDevice.id)}`)
        } catch (error) {
            console.log("error")
        }
        setDevicePopup(false)
    }

    const onAddDeviceToUserClicked = async() => {
        const allDevices = await axios.get(`http://localhost:8083/Administrator/GetDevicesForUser/${parseInt(currentRow.id)}`)
        let devs = [];
        for (const device of allDevices.data) {
            devs.push(device.description)
        }
        setDevices(devs)
        setPopupOn(false);
        setAddDeviceToUserPopup(true)
    }

    const onDropdownDeviceChange = (e) => {
        setSelectedDevice(e.value)
    }

    const AddDeviceToUserClicked = async() => {
        try{
            var idDeviceSelected = await axios.get(`http://localhost:8083/Administrator/GetDeviceIdByName/${selectedDevice}`)
            const params = {
                idDevice: idDeviceSelected.data,
                idUser:parseInt(currentRow.id)
            }
            await axios.post(`http://localhost:8083/Administrator/MapUserDevice`, params)  

        }catch(err){
            console.log(err)
        }
        setAddDeviceToUserPopup(false)
    }

    return(
        <div className="dashboard">
        <div className="admin-dashboard">
            <div className="admin-card">
                <h2 className="welcome-title">Welcome admin!</h2>
                <div className="view-users-table">
                    <p>You can see all users in the table below.</p>
                    <div className="users-table">
                        {usersTable()}
                    </div>
                     <Popup trigger={<div className="add-btn"><button className="my-btn"> Add user</button></div>}>
                            <div>
                            <input className="name"
                                    type="text"
                                    placeholder="Name"
                                    onChange= {(e) => {onNameChanged(e)}}
                                    value={nameValue}/>
                                <input className="email"
                                    type="text"
                                    placeholder="Email"
                                    onChange= {(e) => {onEmailChanged(e)}}
                                    value={emailValue}/>
                                <input
                                    type="password"
                                    placeholder="Password" 
                                    value={passwordValue}
                                    onChange= {(e) => {onPasswordChanged(e)}}/>
                                <Dropdown 
                                options={ROLES} 
                                onChange={(e) => onDropdownChange(e)} 
                                value={role} 
                                placeholder="Select a role"/>
                                <button className="my-btn" onClick={onAddClicked}>Add new user</button>
                            </div>
                        </Popup>
                </div>
            </div>
        </div>
        {
            popupOn && (
            <div className="popup" ref={ref}>
                <div className="update-delete-buttons">
                    <button className="my-btn" onClick={onUpdateBtnClicked}>Update User</button>
                    <button className="my-btn" onClick={onDeleteClicked}>Delete User</button>
                    <button className="my-btn" onClick={onAddDeviceToUserClicked}>Add Device to User</button>
                </div>
            </div>
            )
        }
        {
            updatePopupOn && (
                <div className="popup" ref={ref}>
                    <div className="update-delete-buttons">
                        <input className="name"
                                type="text"
                                placeholder="Name"
                                onChange= {(e) => {onNameChanged(e)}}
                                value={nameValue}/>
                        <input className="email"
                                type="text"
                                placeholder="Email"
                                onChange= {(e) => {onEmailChanged(e)}}
                                value={emailValue}/>
                        <input
                            type="password"
                            placeholder="Password" 
                            value={passwordValue}
                            onChange= {(e) => {onPasswordChanged(e)}}/>
                        <Dropdown 
                            className="dropdown"
                            options={ROLES} 
                            onChange={(e) => onDropdownChange(e)} 
                            value={role} 
                            placeholder="Select a role"/>
                        <button className="my-btn" onClick={onUpdateClicked}>Update</button>
                    </div>
                </div>
            )
        }
        {
            addDeviceToUserPopup && (
            <div className="popup" ref={ref}>
                <div className="add-device-to-user">
                <Dropdown 
                            className="dropdown"
                            options={devices} 
                            onChange={(e) => onDropdownDeviceChange(e)} 
                            value={selectedDevice} 
                            placeholder="Select a device"/>
                    <button className="my-btn" onClick={AddDeviceToUserClicked}>Add Device to User</button>
                </div>
            </div>
            )
        }
        <br></br>
        <div className="admin-dashboard">
            <div className="admin-card">
                <div className="users-table">
                    {devicesTable()}
                    <Popup trigger={<div className="add-btn"><button className="my-btn"> Add device</button></div>}>
                        <div>
                            <input className="description"
                                    type="text"
                                    placeholder="Description"
                                    onChange= {(e) => {onDescriptionChanged(e)}}
                                    value={descriptionValue}/>
                            <input className="address"
                                    type="text"
                                    placeholder="Address"
                                    onChange= {(e) => {onAddressChanged(e)}}
                                    value={addressValue}/>
                            <input
                                    type="text"
                                    placeholder="Maximum Energy Consumption" 
                                    value={maxEnConsValue}
                                    onChange= {(e) => {onMaxEnChanged(e)}}/>
                        <button className="my-btn" onClick={onAddDeviceClicked}>Add new device</button>
                    </div>
                    </Popup>
                </div>
            </div>  
        </div>
        {
            devicePopup && 
            <div className="popup" ref={ref}>
                <button className="my-btn" onClick={onDeleteDeviceClicked}>Delete device</button>
            </div>
        }
        </div>
    )
}

export default AdminDashboard;