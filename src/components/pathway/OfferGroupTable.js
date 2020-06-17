import React, { useState, useEffect, memo } from 'react';
import {
  Form,
  Select,
  Table,
  Popconfirm,
  Button,
  InputNumber,
  Input,
  Row,
  message,
} from 'antd';
import OfferStore from 'store/Offer';
import {
  each,
  groupBy,
  map,
  find,
  findIndex,
  sortBy,
  indexOf,
  uniqueId,
  head,
  uniqBy,
  flow,
  flowRight,
} from 'lodash';
import dayjs from 'dayjs';
import MiniOfferTable from 'components/pathway/OfferGroupTable';
import 'assets/scss/antd-overrides.scss';

const { Option } = Select;
const { Column } = Table;

function getOfferOptions({ existingOffers = [] }) {
  const Store = OfferStore.useContainer();
  const { entities = {} } = Store;
  const offers = Object.values(entities);

  const allOptions = offers.map((offer, index) => (
    <Option value={offer.id} key={index}>
      {offer.name}
    </Option>
  ));

  const defaultValues = uniqBy(
    map(existingOffers, (o) => {
      return o.offer_id;
    })
  );

  return { allOptions, defaultValues };
}

function getExistingOffers(pathway) {
  let offers = [];
  let groups = groupBy(pathway.GroupsOfOffers, 'group_name');
  each(groups, (offerInTheGroup, group_name) => {
    offers.push({
      group_name: group_name,
      offers: offerInTheGroup,
      removed: false,
    });
  });

  return offers;
}

// const MiniOfferTable = memo((props) => {
//   let { groupOfOffers = [], offerStore } = props;

//   groupOfOffers = flow([
//     (g) => uniqBy(g, 'offer_id'),
//     (g) => sortBy(g, (date) => new Date(date.createdAt)),
//   ])(groupOfOffers);

//   return (
//     <Table
//       dataSource={groupOfOffers}
//       pagination={{ position: ['topRight'], pageSize: 4 }}
//       rowKey={(record) => {
//         return uniqueId(record.group_name + '__');
//       }}
//     >
//       <Column
//         dataIndex="group_name"
//         render={(text, record, index) => ({
//           children: index + 1,
//         })}
//       />
//       <Column
//         title="Offer"
//         dataIndex="offer_id"
//         key="offer_id"
//         render={(offerId, record, index) => {
//           const offer = offerStore.entities[offerId];
//           return {
//             children: offer.name || '',
//           };
//         }}
//       />
//       <Column
//         title="Created"
//         dataIndex="offer_id"
//         key="createdAt"
//         render={(offerId, record, index) => {
//           const offer = offerStore.entities[offerId];
//           return {
//             children: offer.createdAt
//               ? dayjs(offer.createdAt).format('MM-DD-YYYY')
//               : null,
//           };
//         }}
//       />
//     </Table>
//   );
// });

const OfferGroupTable = ({
  pathway,
  groupsOfOffers,
  setGroupsOfOffers,
  form,
}) => {
  const offerStore = OfferStore.useContainer();
  const [groupNameField, setGroupNameField] = useState('');

  useEffect(() => {
    if (pathway && pathway.GroupsOfOffers) {
      setGroupsOfOffers(getExistingOffers(pathway));
    }
  }, [pathway]);

  let addGroupHandler = () => {
    const exist = find(groupsOfOffers, ['group_name', groupNameField]);
    if (exist) {
      message.error('Group already exist');
      return;
    }
    setGroupsOfOffers([
      ...groupsOfOffers,
      { group_name: groupNameField, offers: [], removed: false },
    ]);
  };

  let removeGroupHandler = (groupName) => {
    groupsOfOffers.forEach((group) => {
      if (group.group_name === groupName) {
        group.removed = true;
      }
    });
    setGroupsOfOffers([...groupsOfOffers]);
  };

  let updateGroupHandler = (groupName, selectedValues) => {
    let currentOffers = [...groupsOfOffers];
    let offerIndex = findIndex(currentOffers, ['group_name', groupName]);
    currentOffers[offerIndex].offers = selectedValues.map((sv) => ({
      offer_id: sv,
    }));
    setGroupsOfOffers(currentOffers);
  };

  const groupNames = [];

  let groupsData = groupsOfOffers.filter((item) => !item.removed);

  if (pathway && pathway.group_sort_order) {
    groupsData = flowRight([
      (d) => sortBy(d, ['year']),
      (d) =>
        d.map((g) => {
          groupNames.push(g.group_name);
          const year = indexOf(pathway.group_sort_order, g.group_name) + 1;
          return {
            ...g,
            year,
          };
        }),
    ])(groupsData);
  }

  const onChangeAlsoValidate = (inputVal) => {
    form.validateFields(groupNames);
    return inputVal;
  };

  return (
    <div className="w-full">
      <Input
        className="w-full rounded-l rounded-r-none ant-input-group-add-on-border-none-p-0"
        style={{ width: '400px', marginBottom: '3px' }}
        placeholder="Group Name"
        name="add-group"
        onChange={(e) => {
          if (e.target.value && e.target.value.length) {
            setGroupNameField(e.target.value);
          }
        }}
        addonAfter={
          <Button
            className="rounded-l-none"
            type="primary"
            onClick={addGroupHandler}
          >
            Add Group
          </Button>
        }
      />
      <Table
        dataSource={groupsData}
        size="small"
        bordered
        className="ant-table-wrapper--responsive w-full mt-1"
        rowClassName={() => 'antd-row'}
        rowKey={(record) => {
          return uniqueId(record.group_name + '__');
        }}
      >
        <Column
          className="antd-col"
          title="Offer Group"
          dataIndex="group_name"
          key="group_name"
          render={(groupNameText, { offers }, index) => {
            const firstOffer = head(offers);
            let totalCost = 0;
            let totalPay = 0;
            let totalCredit = 0;
            each(offers, function (o) {
              if (offerStore.entities[o.offer_id]) {
                const offer = offerStore.entities[o.offer_id];
                totalCost += offer.cost;
                totalPay += offer.pay;
                totalCredit += offer.credit;
              }
            });
            let defaultVal = null;
            if (pathway && pathway.group_sort_order) {
              defaultVal = indexOf(pathway.group_sort_order, groupNameText);
            }
            return {
              children: (
                <ul key={groupNameText + '__' + index}>
                  <li className="font-bold">{groupNameText}</li>
                  <li>Cost: ${totalCost}</li>
                  <li>Pay: ${totalPay}</li>
                  <li>Credit: {totalCredit}</li>
                  <li>
                    <Row className="items-center" style={{ width: 130 }}>
                      Year:
                      <Form.Item
                        className="my-auto mx-1"
                        name={groupNameText}
                        initialValue={defaultVal ? defaultVal + 1 : index + 1}
                        rules={[
                          { required: true, message: 'Please set a year' },
                        ]}
                      >
                        <InputNumber
                          size="small"
                          min={1}
                          max={groupsData.length}
                          onChange={onChangeAlsoValidate}
                        />
                      </Form.Item>
                    </Row>
                  </li>
                  <li>
                    <Row
                      className="items-center flex-no-wrap"
                      style={{ width: 130 }}
                    >
                      Semester:
                      <Form.Item
                        className="my-auto mx-1 w-full"
                        name={`${groupNameText}_semester`}
                        initialValue={
                          firstOffer && firstOffer.semester
                            ? firstOffer.semester
                            : null
                        }
                      >
                        <Select size="small" style={{ minWidth: '6rem' }}>
                          <Option value="fall">Fall</Option>
                          <Option value="winter">Winter</Option>
                          <Option value="spring">Spring</Option>
                          <Option value="summer">Summer</Option>
                        </Select>
                      </Form.Item>
                    </Row>
                  </li>
                </ul>
              ),
              props: {
                'data-title': 'Offer Group',
              },
            };
          }}
        />
        <Column
          className="antd-col"
          title="Offers"
          dataIndex="inputName"
          key="inputName"
          render={(inputName, record) => {
            const { defaultValues, allOptions } = getOfferOptions({
              existingOffers: record.offers,
            });
            return {
              children: (
                <Form.Item className="my-auto" name={inputName}>
                  <MiniOfferTable
                    groupOfOffers={record.offers}
                    offerStore={offerStore}
                  />
                  <Select
                    className="mt-1 w-full rounded custom-select-rounded-tr-none"
                    showSearch
                    mode="multiple"
                    defaultValue={defaultValues}
                    onChange={(value) =>
                      updateGroupHandler(record.group_name, value)
                    }
                  >
                    {allOptions}
                  </Select>
                </Form.Item>
              ),
              props: {
                'data-title': 'Offers',
              },
            };
          }}
        />
        <Column
          className="antd-col"
          title="Action"
          render={(text, record, index) => ({
            children: (
              <Popconfirm
                key={index}
                className="text-red-500 cursor-pointer"
                title="Are you sure you want to delete this group?"
                onConfirm={() => removeGroupHandler(record.group_name)}
                okText="Yes"
                cancelText="No"
              >
                Remove
              </Popconfirm>
            ),
            props: {
              'data-title': 'Action',
            },
          })}
        />
      </Table>
    </div>
  );
};

export default memo(OfferGroupTable);
