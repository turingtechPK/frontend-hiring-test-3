import React, { useState, useEffect } from 'react'
import './CallDetails.css'
import { ENDPOINTS } from '../../apis/endpoints'
import { getRequest, postRequest } from '../../apis'
import { useParams } from 'react-router-dom'
import { BsArchiveFill, BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const CallDetails = () => {
    const [callData, setCallData] = useState('')

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getDetails()
    }, [])

    async function getDetails() {
        try {
            let URL = ENDPOINTS.getCallDetails
            URL = URL.replace(':id', params.callID)
            const { data, status } = await getRequest(URL)
            console.log(data, status)
            if (status === 200) setCallData(data)
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
            if (status === 200) getDetails()
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div>
            <h4 className='heading'>Call Details</h4>
            <div className='callCard'>
                <div className='call-details'>
                    <div className='call-detail-block'>
                        <p className='label'>Call ID: </p>
                        <span className='value'>{callData.id}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>From: </p>
                        <span className='value'>{callData.from}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>To: </p>
                        <span className='value'>{callData.to}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>Call Type: </p>
                        <span className='value'>{callData.call_type}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>Call Time: </p>
                        <span className='value'>{moment(callData.created_at).format('hh:mm a')}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>Direction: </p>
                        <span className='value'>{callData.direction}</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>Duration: </p>
                        <span className='value'>{callData.duration} (seconds)</span>
                    </div>

                    <div className='call-detail-block'>
                        <p className='label'>Is Archived: </p>
                        <span className='value'>{callData.is_archived ? 'True' : 'False'}</span>
                    </div>
                </div>

                <div className='actionBlock'>
                    <button className='backBtn actionBtn' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <BsArrowLeft />
                        Go Back
                    </button>
                    <button className='archiveBtn actionBtn' onClick={() => archiveCall(callData.id)} style={{ cursor: 'pointer' }}>
                        <BsArchiveFill />
                        Archive Call
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CallDetails