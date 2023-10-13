import { useState, useEffect } from "react"
import axios from 'axios'
import  Dropdown  from "react-dropdown"
import "../styles/pageStyle.scss"

const MeasurementValuesPage = () => {
    const [data, setData] = useState("")
    const [buttonPressed, setButtonPressed] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [devices, setDevices] = useState(null)

    useEffect(() =>{
        const interval = setInterval(async () => {
            const notifications = await axios.get(`http://localhost:8083/User/GetNotification/${1}`)
            setData(notifications.data)
            console.log(notifications.data);
        }, 5000);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        (async () => getDevices())()
    },[])

    const getDevices = async () => {
        try{
            const allDevices = await axios.get(`http://localhost:8083/User/GetDevices/${localStorage.getItem('userId')}`)
            let devs = [];
            for (const device of allDevices.data) {
                devs.push(device.description)
        }
        setDevices(devs)
        }catch(err){
            console.log(err)
        }
    }

    const tableOfMeasuredData = () => {
        return(
        <table className="table-notifications" >
            <thead>
            <tr className="table-tr-notifications">
                <th className="table-th-notifications">
                <b>Notifications</b>
                </th>
            </tr>
            </thead>
            <tbody className="table-body-notifications">
            {data?.map((val, key) => {
                return (
                <tr key={key}>
                    <td className="table-td-notifications">{val}</td>
                </tr>
                );

                })}
            </tbody>
        </table>
        )
    }
    const dataTable = () => {
        if(data?.length){
            return tableOfMeasuredData()
        }
    }

    const onDropdownDeviceChange = (e) => {
        setButtonPressed(true)
        setSelectedDevice(e.value)
    }

    const getAllDevices = () => {
            return <Dropdown 
            className="dropdown"
            options={devices} 
            onChange={(e) => onDropdownDeviceChange(e)} 
            value={selectedDevice} 
            placeholder="Select a device"/>
    }
    return (
        <div className="dashboard">
            <div className="admin-dashboard">
                <div className="admin-card">
                    {
                        buttonPressed ? (
                            <div>{dataTable()}</div>
                        ) : (
                            <div>
                                <p>Please select one of your devices</p>
                                {getAllDevices()}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MeasurementValuesPage;