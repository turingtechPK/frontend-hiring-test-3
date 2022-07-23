import React, { useState, useEffect } from 'react'
import { getRequest, postRequest } from '../../apis'
import { ENDPOINTS } from '../../apis/endpoints'
import { BsFillTelephoneInboundFill, BsFillTelephoneOutboundFill, BsArchiveFill, BsFillEyeFill } from "react-icons/bs"
import { BiReset } from 'react-icons/bi'
import moment from 'moment'
import './Activity.css'
import { useNavigate } from 'react-router-dom'

const Activity = () => {
    const [activityData, setActivityData] = useState([])

    const navigate = useNavigate()
    
    useEffect(() => {
        getActivityList()
    }, [])

    async function getActivityList() {
        try {
            const URL = ENDPOINTS.getActivities
            let { data, status } = await getRequest(URL)
            // console.log(data, status)
            data = data.filter((element) => !element.is_archived) // filter the is archived logs
            if (status === 200) setActivityData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const resetCalls = async () => {
        try {
            const URL = ENDPOINTS.resetCalls
            const { data, status } = await getRequest(URL)
            // console.log(data, status)
            if (status === 200) getActivityList() // if reset call successful, fetch logs again
        } catch (error) {
            console.log(error)
        }
    }

    const archiveCall = async (callID) => {
        try {
            let URL = ENDPOINTS.updateCall
            URL = URL.replace(':id', callID)
            let body = {
                is_archived: true
            }
            const { data, status } = await postRequest(URL, body)
            // console.log(data, status)
            if (status === 200) getActivityList()
        } catch (error) {
            console.log(error)
        }
    }    

    return (
        <div>
            <h4 className='heading'>Activity Logs</h4>
            <div className='actionBtnBlock'>
                {/* <button className='archiveBtn actionBtn' onClick={() => archiveAllCalls()}>
                    <BsArchiveFill />
                    Archive All Calls
                </button> */}
                <button className='resetBtn actionBtn' onClick={() => resetCalls()}>
                    <BiReset />
                    Reset
                </button>
            </div>
            { activityData.map((activity) => {
                return (
                    <div key={activity.id} className='card'>
                        { activity.direction === 'inbound' ? (
                            <BsFillTelephoneInboundFill />
                        ) : (
                            <BsFillTelephoneOutboundFill />
                        )}
                        <div className='details'>
                            <div>
                                <p className='text callNumber'>{activity.to}</p>
                                <p className='text callName'>Caller: {activity.from}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center'}}>
                                <p className='text callTime'>{ moment(activity.created_at).format('hh:mm a') }</p>
                                <BsArchiveFill onClick={() => archiveCall(activity.id)} />
                                <BsFillEyeFill 
                                    onClick={() => {
                                        localStorage.setItem('callID', activity.id)
                                        navigate(`/${activity.id}`)
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                )
            }) }
        </div>
    )
}

export default Activity