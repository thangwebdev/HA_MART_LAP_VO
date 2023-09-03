import React from 'react'
import AreaInput from '~/components/input/AreaInput'

function DescriptionTab({register}) {
  return (
    <div>
        <AreaInput name='ghi_chu' placeholder='Ghi chú' register={register} />
    </div>
  )
}

export default DescriptionTab