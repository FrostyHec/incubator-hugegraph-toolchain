/*
 * Copyright 2017 HugeGraph Authors
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
package com.baidu.hugegraph.structure.constant;

public enum DataType {

    OBJECT(1, "object"),
    BOOLEAN(2, "boolean"),
    BYTE(3, "byte"),
    BLOB(4, "blob"),
    DOUBLE(5, "double"),
    FLOAT(6, "float"),
    INT(7, "int"),
    LONG(8, "long"),
    TEXT(9, "text"),
    TIMESTAMP(10, "timestamp"),
    UUID(11, "uuid");

    private byte code = 0;
    private String name = null;

    private DataType(int code, String name) {
        assert code < 256;
        this.code = (byte) code;
        this.name = name;
    }

    public byte code() {
        return this.code;
    }

    public String string() {
        return this.name;
    }

}
