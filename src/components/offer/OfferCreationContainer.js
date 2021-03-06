import React, { useEffect, useRef } from 'react';
import { Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import OfferForm from 'components/offer/OfferForm';
import useGlobalStore from 'store/GlobalStore';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import { head, reject } from 'lodash';
import { useImageAndBannerImage } from 'hooks';

configure({
  axios: axiosInstance,
});

const OfferCreationContainer = ({ closeModal, role, providerId }) => {
  const { id: userId, provider_id } = AuthService.currentSession;
  const formRef = useRef(null);
  const [
    { file, onChangeFileUpload },
    { bannerFile, onChangeBannerUpload },
  ] = useImageAndBannerImage();
  const [form] = Form.useForm();
  const [{ data: offerPayload, error: offerError }, createOffer] = useAxios(
    {
      url: '/offers',
      method: 'POST',
    },
    { manual: true }
  );

  const {
    datafield: datafieldStore,
    provider: providerStore,
    offer: offerStore,
  } = useGlobalStore();

  let providerEntities = Object.values(providerStore.entities);

  const submit = async () => {
    try {
      const values = await form.validateFields([
        'category',
        'description',
        'learn_and_earn',
        'frequency',
        'frequency_unit',
        'cost',
        'cost_unit',
        'credit_unit',
        'pay_unit',
        'length',
        'length_unit',
        'name',
        'provider_id',
        'topics',
        'pay',
        'credit',
        'keywords',
        'related_offers',
        'prerequisites',
        'is_local_promo',
        'is_main_promo',
        'external_url',
      ]);

      const { provider_id } = values;

      const offerResponse = await createOffer({
        data: {
          ...values,
          provider_id,
        },
      });

      if (offerResponse.data) {
        offerStore.addOne(offerResponse.data);
      }

      if (offerResponse.data && userId) {
        const fileable_type = 'offer';
        let clonedResponse = Object.assign(offerResponse.data);
        const filePayload = [];
        if (file) {
          const results = await UploaderService.uploadFile(file, {
            uploaded_by_user_id: userId,
            fileable_type,
            fileable_id: offerResponse.data.id,
          });

          if (results && results.file.data) {
            filePayload.push({ ...results.file.data });
          }

          if (results.success) {
            notification.success({
              message: 'Success',
              description: 'Main image is uploaded',
            });
          }
        }
        if (bannerFile) {
          const results = await UploaderService.uploadFile(bannerFile, {
            uploaded_by_user_id: userId,
            fileable_type,
            fileable_id: offerResponse.data.id,
            meta: 'banner-image',
          });

          if (results && results.file.data) {
            filePayload.push({ ...results.file.data });
          }

          if (results.success) {
            notification.success({
              message: 'Success',
              description: 'Banner image is uploaded',
            });
          }
        }
        clonedResponse.Files = [...filePayload];
        offerStore.updateOne(clonedResponse);
      }

      if (offerResponse && offerResponse.status === 201) {
        notification.success({
          message: offerResponse.status,
          description: 'Successfully created offer',
        });
        form.resetFields();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (formRef.current && role === 'provider') {
      if (providerEntities.length) {
        providerEntities = reject(providerEntities, (p) => {
          return !(p.id === providerId);
        });

        form.setFieldsValue({
          provider_id: head(providerEntities).id,
        });
      }
    }

    if (offerError) {
      const { status, statusText } = offerError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
  }, [offerPayload, offerError, formRef]);

  return (
    <div>
      <Form form={form} name="offerForm" ref={formRef}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <OfferForm
            role={role}
            offers={Object.values(offerStore.entities)}
            datafields={datafieldStore.entities}
            providers={providerEntities}
            userId={userId}
            providerId={provider_id}
            file={file}
            onChangeUpload={onChangeFileUpload}
            bannerFile={bannerFile}
            onChangeBannerUpload={onChangeBannerUpload}
          />
        </div>
        <section
          className="bg-white px-6 pt-5 pb-1 flex justify-center"
          style={{
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button
            className="mr-3 px-10 rounded"
            type="primary"
            size="small"
            htmlType="submit"
            onClick={submit}
          >
            Create
          </Button>
          <Button
            className="px-10 rounded"
            size="small"
            type="dashed"
            onClick={() => closeModal()}
          >
            Cancel
          </Button>
        </section>
      </Form>
    </div>
  );
};

export default OfferCreationContainer;
