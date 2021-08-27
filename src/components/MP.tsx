import React, { useEffect, useState } from 'react';

import { ContentType, PageExtensionSDK } from '@contentful/app-sdk';
import { Heading, WorkbenchContent } from '@contentful/forma-36-react-components';

import Collection from './Collection';
import CollectionList from './CollectionList';

interface DashboardProps {
  sdk: PageExtensionSDK;
  contentTypes: ContentType[];
}

interface CollectionsState {
  items: [] | null;
  total: number | null;
  published: number | null;
  scheduled: number | null;
}

export default function MP({ sdk, contentTypes }: DashboardProps) {
  const [data, setData] = useState<CollectionsState>({
    items: null,
    total: null,
    published: null,
    scheduled: null,
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch some basic statistics.
      const [entries, published, scheduled] = await Promise.all([
        sdk.space
          .getEntries({
            content_type: 'pagePagetypeLpBob',
            'fields.businessUnit': 'MP',
            order: 'sys.createdAt',
            include: 10,
          })
          .then((entries: any) => entries)
          .catch(() => 0),
        sdk.space
          .getPublishedEntries({
            content_type: 'page',
            'fields.content.sys.contentType.sys.id': 'pagePagetypeLpBob',
            order: 'sys.createdAt',
          })
          .then((entries) => entries.total)
          .catch(() => 0),
        sdk.space
          .getAllScheduledActions()
          .then((entries) => entries.length)
          .catch(() => 0),
      ]);
      const total = entries.total;
      const items = entries.items;

      console.log(entries);

      setData({ ...data, items, total, published, scheduled });
    }

    fetchData();
  }, []);

  const createPage = () => {
    sdk.space
      .createEntry('pagePagetypeLpBob', {
        fields: {
          businessUnit: {
            de: 'MP',
          },
          name: {
            de: 'Untitled - NEW MP LP',
          },
          title: {
            de: 'NEW MP LP',
          },
        },
      })
      .then((entry: any) => {
        const newItems = [...(data.items as any)];
        newItems.push(entry);
        setData({ ...data, ...{ items: newItems } });
        console.log('data', data);
      })
      .catch(console.error);
  };

  return (
    <WorkbenchContent className="f36-margin-top--xl">
      <div id="collections">
        <Collection label="Total entries" value={data.total} />
        <Collection label="Published entries" value={data.published} />
        <Collection label="Scheduled entries" value={data.scheduled} />
      </div>

      <div className="f36-margin-top--xl">
        <Heading element="h2">Pages</Heading>
        <CollectionList
          entries={data.items}
          onClickItem={(entryId) => sdk.navigator.openEntry(entryId)}
          onAddNew={createPage}
        />
      </div>
    </WorkbenchContent>
  );
}
