import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent, Button, Grid, DialogTitle } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import cssStyles from '../../../../utils/cssStyles';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import LightboxModal from '../../../../components/LightboxModal';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { DocForm } from '../../doc';

import { DialogAnimate } from '../../../../components/animate';

// ----------------------------------------------------------------------

const CaptionStyle = styled(CardContent)(({ theme, height }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  height: '100%',
  justifyContent: 'space-between',
  color: theme.palette.common.white
}));

// ----------------------------------------------------------------------

ProfileDocs.propTypes = {
  gallery: PropTypes.array.isRequired
};

export default function ProfileDocs({ gallery, height }) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const imagesLightbox = gallery.map((img) => img.imageUrl);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Grid container direction="row" justifyContent="space-between" marginBottom={5}>
        {/* <Typography sx={{ mb: 3 }}> */}
        <Typography variant="h4">Docs</Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          // component={RouterLink}
          // to={PATH_DASHBOARD.network.contacts}
          startIcon={<Icon icon={plusFill} />}
        >
          New Docs
        </Button>
        {/* </Typography> */}
      </Grid>

      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }
          }}
        >
          {gallery.map((image) => (
            <GalleryItem key={image.id} image={image} onOpenLightbox={handleOpenLightbox} />
          ))}
        </Box>

        <LightboxModal
          images={imagesLightbox}
          mainSrc={imagesLightbox[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        />
      </Card>
      <DialogAnimate open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add Document</DialogTitle>
        <DocForm onCancel={handleCloseModal} />
      </DialogAnimate>
    </Box>
  );
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
  image: PropTypes.object,
  onOpenLightbox: PropTypes.func
};

function GalleryItem({ image, onOpenLightbox }) {
  const { imageUrl, title, postAt } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }} onClick={() => onOpenLightbox(imageUrl)}>
      <Image alt="gallery image" ratio="1/1" src={imageUrl} onClick={() => onOpenLightbox(imageUrl)} />

      <CaptionStyle>
        <div>
          <Typography variant="subtitle1">
            {/* {title} */}
            Portfolio
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {/* {fDate(postAt)} */}
            GoogleDrive
          </Typography>
        </div>
        <IconButton color="inherit">
          {/* <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} /> */}
          <Iconify icon={'carbon:document-tasks'} width={20} height={20} />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}
