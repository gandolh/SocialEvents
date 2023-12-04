import AllEventsMap from '@/components/Geolocation/organisms/AllEventsMap';
import { Dialog } from '@/components/Shared/molecules/Dialog';
import ModalLayout from './ModalLayout';
import SingleEventMap from '@/components/Geolocation/organisms/SingleEventMap';
import { Event } from '@/types/Event';

type ModalMapProps = {
  handleOpen: () => void;
  open: boolean;
  showAll?: boolean;
  event?: Event;
}

const ModalMap = ({ handleOpen, open, showAll, event } :ModalMapProps) => {
  return (<Dialog size='xl' className='rounded-lg' handler={handleOpen} open={open}>
    <ModalLayout handleOpen={handleOpen} title='Maps'>
      {showAll && <AllEventsMap width='100%' height='70vh' />}
      {!showAll && <SingleEventMap event={event} width='100%' height='70vh' />}
    </ModalLayout>

  </Dialog>);
}

export default ModalMap;