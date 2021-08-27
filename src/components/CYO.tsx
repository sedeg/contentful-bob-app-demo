import React, { useEffect, useState } from 'react';

import { ContentType, PageExtensionSDK } from '@contentful/app-sdk';
import { WorkbenchContent, Paragraph } from '@contentful/forma-36-react-components';

import CollectionList from '../components/CollectionList';

// Define rules for incomplete entries.
const INCOMPLETE_CHECK_CONTENT_TYPE = 'album';
const INCOMPLETE_CHECK_REQUIRED_FIELD = 'artist';

interface IncompleteEntriesProps {
  sdk: PageExtensionSDK;
  contentTypes: ContentType[];
}

export default function CYO({ contentTypes, sdk }: IncompleteEntriesProps) {
  const [incompleteEntries, setIncompleteEntries] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchIncompleteEntries() {
      // Fetch entries that don't have an author (incomplete posts).
      const entries = await sdk.space
        .getEntries({
          [`fields.${INCOMPLETE_CHECK_REQUIRED_FIELD}[exists]`]: false,
          content_type: INCOMPLETE_CHECK_CONTENT_TYPE,
          limit: 3,
        })
        .then((entries) => entries.items)
        .catch(() => []);

      setIncompleteEntries(entries);
    }

    fetchIncompleteEntries();
  }, []);

  const createPage = () => {
    sdk.space
      .createEntry('pagePagetypeLpBob', {
        fields: {
          businessUnit: {
            de: 'CYO',
          },
          name: {
            de: 'Untitled - NEW CYO LP',
          },
          title: {
            de: 'NEW CYO LP',
          },
        },
      })
      .then((entry) => setIncompleteEntries(incompleteEntries.push(entry)))
      .catch(console.error);
  };

  return (
    <WorkbenchContent className="f36-margin-top--xl">
      <Paragraph>CYO - LPs</Paragraph>
      <CollectionList
        entries={incompleteEntries}
        onClickItem={(entryId) => sdk.navigator.openEntry(entryId)}
        onAddNew={createPage}
      />
    </WorkbenchContent>
  );
}
