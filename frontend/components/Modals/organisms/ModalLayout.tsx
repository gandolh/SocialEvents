import { FaTimes } from 'react-icons/fa';
import { DialogBody, DialogHeader } from '@/components/Shared/molecules/Dialog';
// import { useTranslations } from 'next-intl';

const ModalLayout = ({handleOpen , children, title}) => {
    const tradText = (a)=>a;// useTranslations('Misc');
    return (
        <>
        <DialogHeader>
        <div className='flex justify-between items-center px-4 w-full'>
          {tradText(title)}
         { 
          <FaTimes className='hover:text-red-600' onClick={handleOpen}/>
         }
         </div>
      </DialogHeader>
      <DialogBody divider className='h-full'>
        {children}
  </DialogBody>
    </>

      );
}
 
export default ModalLayout;