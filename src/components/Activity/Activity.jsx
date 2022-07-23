import React, { useState, useEffect } from 'react'
import { getRequest, postRequest } from '../../apis'
import { ENDPOINTS } from '../../apis/endpoints'
import { BsArrowRightShort } from "react-icons/bs"
import { BiReset } from 'react-icons/bi'
import moment from 'moment'
import './Activity.css'
import { useNavigate } from 'react-router-dom'
import { HiPhoneIncoming, HiPhoneOutgoing, HiOutlineArchive } from 'react-icons/hi'

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

    const archiveAllCalls = () => {
        const promies = []
        activityData.forEach((item) => {
            promies.push(archiveCall(item.id, true))
        })

        Promise.all(promies)
            .then((res) => {
                getActivityList()
            })
            .catch((e) => {
                console.log(e)
            })
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

    const archiveCall = async (callID, type = false) => {
        try {
            let URL = ENDPOINTS.updateCall
            URL = URL.replace(':id', callID)
            let body = {
                is_archived: true
            }
            const { data, status } = await postRequest(URL, body)
            // console.log(data, status)
            if (status === 200 && !type) getActivityList()
        } catch (error) {
            console.log(error)
        }
    }    

    const activityFeed = activityData.map((activity) => {
        return (
            <div key={activity.id} className='card' onClick={() => {
                localStorage.setItem('callID', activity.id)
                navigate(`/${activity.id}`)
            }}>
                { activity.direction === 'inbound' ? (
                    <HiPhoneIncoming style={{ width: '24px', height: '35px'}} />
                ) : (
                    <HiPhoneOutgoing style={{ width: '24px', height: '35px'}} />
                )}
                <div className='details'>
                    <div>
                        <p className='text callNumber'>{activity.to}</p>
                        <p className='text callName'>Caller: {activity.from}</p>
                        <p className='text callName callView' style={{ paddingTop: '1rem' }}
                            onClick={() => {
                                localStorage.setItem('callID', activity.id)
                                navigate(`/${activity.id}`)
                            }}>
                            View Details <BsArrowRightShort style={{ verticalAlign: 'middle' }} />
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center'}}>
                        <p className='text callTime'>{ moment(activity.created_at).format('hh:mm a') }</p>
                        <HiOutlineArchive onClick={(e) => {
                            archiveCall(activity.id)
                            e.stopPropagation()
                        }} />
                        {/* <BsFillEyeFill 
                            onClick={() => {
                                localStorage.setItem('callID', activity.id)
                                navigate(`/${activity.id}`)
                            }} 
                        /> */}
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div>
            <h4 className='heading'>Activity Feed</h4>
            <div className='actionBtnBlock'>
                <button className='archiveBtn actionBtn' onClick={() => archiveAllCalls()}>
                    <HiOutlineArchive />
                    Archive All Calls
                </button>
                <button className='resetBtn actionBtn' onClick={() => resetCalls()} style={{ cursor: 'pointer' }}>
                    <BiReset />
                    Reset
                </button>
            </div>
            { activityData.length ? activityFeed : <p style={{ display: 'flex', margin: '1rem auto', justifyContent: 'center', width: '50%' }}>No Logs Found</p> }
        </div>
    )
}

export default Activity