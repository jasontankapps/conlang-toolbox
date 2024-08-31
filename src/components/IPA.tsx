import React, { FC, PropsWithChildren } from "react";

const IPA: FC<PropsWithChildren<{}>> = (text) => (<i className="ipa">/{text.children}/</i>);

export default IPA;
