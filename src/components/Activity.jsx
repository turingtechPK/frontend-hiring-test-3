import React, { useState, useEffect } from 'react'
import { getRequest } from '../apis'
import { ENDPOINTS } from '../apis/endpoints'
import { BsFillTelephoneInboundFill, BsFillTelephoneOutboundFill } from "react-icons/bs";
import moment from 'moment'
import './Activity.css'

const Activity = () => {
    const [activityData, setActivityData] = useState([])
    
    useEffect(() => {
        getActivityList()
    }, [])

    async function getActivityList() {
        try {
            const URL = ENDPOINTS.getActivities
            const { data, status } = await getRequest(URL)
            // console.log(data, status)
            if (status === 200) setActivityData(data)
        } catch (error) {
            console.log(error)
        }
    }
    

    return (
        <div>
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
                            <div>
                                <p>{ moment(activity.created_at).format('HH:mm a') }</p>
                            </div>
                        </div>
                    </div>
                )
            }) }
        </div>
    )
}

export default Activity