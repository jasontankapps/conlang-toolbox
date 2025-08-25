import React, { FC, PropsWithChildren } from "react";

const IPA: FC<PropsWithChildren<object>> = (text) => (<i className="ipa">/{text.children}/</i>);

export default IPA;
