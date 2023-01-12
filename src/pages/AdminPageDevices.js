import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { BarChart } from "../components/BarChart";
import Chart from 'chart.js/auto';

const AdminPageDevices = () => {
    const {setDevices} = useContext(AppContext)
    const [allDevices, setAllDevices] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [renderChart, setRenderChart] = useState(false)

    useEffect(() => {
        (async () => getDevices())()
    },[])

    const getDevices = async () => {
        try{
            const devicesFound = await axios.get(`http://localhost:8083/User/GetDevices/${localStorage.getItem('userId')}`)
            setDevices(JSON.stringify(devicesFound.data))
            setAllDevices(JSON.parse(localStorage.getItem("devices")))
        }catch(err){
            console.log(err)
        }
    }

    const onDeviceClicked = async (e,val) => {
        try{
            const monitoredData = await axios.get(`http://localhost:8083/User/GetMonitoredData/${val.id}`)
            let label = []
            let data = []
            label = monitoredData.data.map((el) => el.timestamp)
            data = monitoredData.data.map((el) => el.energyConsumption)
            setChartData({
                labels: label,
                datasets: [{label: "Energy Consumption",
                data: data,
                backgroundColor: ["rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",],
                borderColor: ["rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",],
                borderWidth: 1,},],})
            setRenderChart(true)
        }catch(err){
            console.log(err)
        }
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
                <tr key={key} onClick={(e) => onDeviceClicked(e,val)}>
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

    const devicesTable = () => {
        if(allDevices?.length){
            return tableOfDevices()
        }
        return <div>There are no devices to display. Please go to Users page and assign to yourself a device.</div>
    }

    const getBarChart = () => {
        return <BarChart chartData={chartData}/>
    }

    return (
        <div className="admin-device-page">
        <h2>You can see below your devices.</h2>
            <div className="device-table">
                <div className="users-table">
                    {devicesTable()}
                </div>
            </div>
            <div className="chard-div">
                <div className="chart">
                    {renderChart && getBarChart()}
                </div>
            </div>
        </div>
    )
}
export default AdminPageDevices;